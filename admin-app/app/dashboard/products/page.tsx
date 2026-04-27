"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Edit3, Plus, RefreshCw, Trash2 } from "lucide-react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import AdminShell, { AdminPanel } from "@/components/admin/AdminShell";
import { formatCurrency, formatDateTime } from "@/utils/admin";
import {
  deleteProduct,
  getCategories,
  getProductCategories,
  getProductImages,
  getProductTypes,
  getProducts,
  upsertProduct,
} from "@/services/admin";
import { ProductCategoryRow, ProductImageRow, ProductRow, ProductTypeRow } from "@/types";

const emptyForm = {
  id: "",
  name: "",
  description: "",
  product_type_id: "",
  price: "",
  discount: "0",
  stock: "0",
  isActive: true,
  categoryIds: [] as string[],
  imageText: "",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeRow[]>([]);
  const [productImages, setProductImages] = useState<ProductImageRow[]>([]);
  const [productCategoryLinks, setProductCategoryLinks] = useState<ProductCategoryRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);

    try {
      const [productData, categoryData, typeData, imageData, linkData] = await Promise.all([
        getProducts(),
        getCategories(),
        getProductTypes(),
        getProductImages(),
        getProductCategories(),
      ]);

      setProducts(productData);
      setCategories(categoryData);
      setProductTypes(typeData);
      setProductImages(imageData);
      setProductCategoryLinks(linkData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [categories]
  );

  const typeMap = useMemo(
    () => Object.fromEntries(productTypes.map((type) => [type.id, type.name])),
    [productTypes]
  );

  const categoriesByProduct = useMemo(() => {
    return productCategoryLinks.reduce<Record<string, string[]>>((accumulator, link) => {
      if (!accumulator[link.product_id]) {
        accumulator[link.product_id] = [];
      }

      accumulator[link.product_id].push(link.category_id);
      return accumulator;
    }, {});
  }, [productCategoryLinks]);

  const imagesByProduct = useMemo(() => {
    return productImages.reduce<Record<string, string[]>>((accumulator, image) => {
      if (!accumulator[image.product_id]) {
        accumulator[image.product_id] = [];
      }

      accumulator[image.product_id].push(image.url);
      return accumulator;
    }, {});
  }, [productImages]);

  const beginEdit = (product: ProductRow) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      product_type_id: product.product_type_id ?? "",
      price: String(product.price ?? ""),
      discount: String(product.discount ?? 0),
      stock: String(product.stock ?? 0),
      isActive: product.isActive,
      categoryIds: categoriesByProduct[product.id] ?? [],
      imageText: (imagesByProduct[product.id] ?? []).join("\n"),
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      await upsertProduct({
        id: form.id || undefined,
        name: form.name.trim(),
        description: form.description.trim(),
        product_type_id: form.product_type_id,
        price: Number(form.price || 0),
        discount: Number(form.discount || 0),
        finalPrice: Number(form.price || 0) - Number(form.discount || 0),
        stock: Number(form.stock || 0),
        isActive: form.isActive,
        categoryIds: form.categoryIds,
        imageUrls: form.imageText.split("\n"),
      });

      toast.success(form.id ? "Product updated" : "Product created");
      resetForm();
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this product and its related inventory/media?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      if (form.id === id) {
        resetForm();
      }
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
    }
  };

  const productCards = products.map((product) => ({
    ...product,
    categories: (categoriesByProduct[product.id] ?? []).map((categoryId) => categoryMap[categoryId]).filter(Boolean),
    images: imagesByProduct[product.id] ?? [],
    typeName: product.product_type_id ? typeMap[product.product_type_id] ?? product.product_type_id : "Unassigned",
  }));

  return (
    <AdminShell
      title="Products"
      description="Create and edit catalog entries, pricing, media, and category links from one workspace."
      actions={
        <Button onClick={() => resetForm()} className="gap-2">
          <Plus className="h-4 w-4" />
          New product
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <AdminPanel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-black">Product form</h3>
              <p className="mt-1 text-sm text-black/60">Create a product, attach categories, and sync media in one pass.</p>
            </div>
            <button
              type="button"
              onClick={() => void reload()}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black transition-colors hover:bg-black/5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="name" className="text-sm font-medium text-black">Name</label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  placeholder="Vintage washed tee"
                  required
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="description" className="text-sm font-medium text-black">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  placeholder="Short product description"
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="min-h-28 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none transition-all placeholder:text-black/30 focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="product_type_id" className="text-sm font-medium text-black">Product type</label>
                <Input
                  id="product_type_id"
                  name="product_type_id"
                  type="text"
                  value={form.product_type_id}
                  placeholder="Type UUID or reference ID"
                  onChange={(event) => setForm((current) => ({ ...current, product_type_id: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium text-black">Price</label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="discount" className="text-sm font-medium text-black">Discount</label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  min="0"
                  value={form.discount}
                  onChange={(event) => setForm((current) => ({ ...current, discount: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium text-black">Stock</label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="finalPrice" className="text-sm font-medium text-black">Final price</label>
                <Input
                  id="finalPrice"
                  name="finalPrice"
                  type="text"
                  value={formatCurrency(Number(form.price || 0) - Number(form.discount || 0))}
                  readOnly
                />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                  className="h-4 w-4 rounded border-border text-emerald-400 focus:ring-emerald-400/30"
                />
                <label htmlFor="isActive" className="text-sm text-black">Active product</label>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium text-black">Categories</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categories.map((category) => {
                    const checked = form.categoryIds.includes(category.id);

                    return (
                      <label key={category.id} className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            setForm((current) => ({
                              ...current,
                              categoryIds: checked
                                ? current.categoryIds.filter((value) => value !== category.id)
                                : [...current.categoryIds, category.id],
                            }));
                          }}
                          className="h-4 w-4 rounded border-border text-emerald-400"
                        />
                        {category.name}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label htmlFor="imageText" className="text-sm font-medium text-black">Image URLs</label>
                <textarea
                  id="imageText"
                  name="imageText"
                  value={form.imageText}
                  placeholder="https://...\nhttps://..."
                  onChange={(event) => setForm((current) => ({ ...current, imageText: event.target.value }))}
                  className="min-h-28 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none transition-all placeholder:text-black/30 focus:border-black focus:ring-2 focus:ring-black/10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={saving} className="gap-2">
                <Edit3 className="h-4 w-4" />
                {saving ? "Saving..." : form.id ? "Update product" : "Create product"}
              </Button>
              <Button type="button" onClick={resetForm} className="bg-black text-white hover:bg-black/90">
                Clear form
              </Button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-black">Catalog list</h3>
              <p className="mt-1 text-sm text-black/60">Select a row to edit. Deleting also removes linked media and categories.</p>
            </div>
            <div className="text-sm text-black/60">{products.length} items</div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-black/10">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-black/10 text-left text-sm">
                <thead className="bg-black/5 text-black">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 bg-white">
                  {loading ? (
                    <tr>
                      <td className="px-4 py-6 text-black/60" colSpan={5}>Loading products...</td>
                    </tr>
                  ) : productCards.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-black/60" colSpan={5}>No products yet.</td>
                    </tr>
                  ) : (
                    productCards.map((product) => (
                      <tr key={product.id} className="align-top">
                        <td className="px-4 py-4">
                          <div className="font-medium text-black">{product.name}</div>
                          <div className="mt-1 text-xs text-black/60">{product.typeName}</div>
                          <div className="mt-1 text-xs text-black/50">{product.categories.join(", ") || "No categories"}</div>
                          <div className="mt-1 text-xs text-black/50">{product.images.length} images</div>
                        </td>
                        <td className="px-4 py-4 text-black">{formatCurrency(Number(product.finalPrice ?? product.price ?? 0))}</td>
                        <td className="px-4 py-4 text-black">{product.stock ?? 0}</td>
                        <td className="px-4 py-4 text-black/60">{formatDateTime(product.updatedAt)}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => beginEdit(product)}
                              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black transition-colors hover:bg-black/5"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(product.id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black transition-colors hover:bg-black/5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
