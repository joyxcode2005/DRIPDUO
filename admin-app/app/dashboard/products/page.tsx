"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Edit3, Plus, RefreshCw, Trash2, ChevronDown, List, Tag } from "lucide-react";
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

// Define our specific image types
export type ImageType = 'FRONT' | 'BACK' | 'FABRIC' | 'DETAIL';
const IMAGE_TYPES: ImageType[] = ['FRONT', 'BACK', 'FABRIC', 'DETAIL'];

const emptyForm = {
  id: "",
  name: "",
  description: "",
  product_type_id: "",
  price: "",
  discount: "0",
  isActive: true,
  categoryIds: [] as string[],
};

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");

  // State variables for typed image uploading
  const [newImageFiles, setNewImageFiles] = useState<Partial<Record<ImageType, File>>>({});
  const [existingImages, setExistingImages] = useState<Partial<Record<ImageType, string>>>({});
  const [uploadingImages, setUploadingImages] = useState(false);

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

  // Group images by product ID, and then by their Type
  const imagesByProduct = useMemo(() => {
    return productImages.reduce<Record<string, Partial<Record<ImageType, string>>>>((accumulator, image) => {
      if (!accumulator[image.product_id]) {
        accumulator[image.product_id] = {};
      }
      // Assuming your database response maps the enum to the string values
      if (image.type) {
        accumulator[image.product_id][image.type as ImageType] = image.url;
      }
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
      isActive: product.is_active ?? true,
      categoryIds: categoriesByProduct[product.id] ?? [],
    });

    setExistingImages(imagesByProduct[product.id] || {});
    setNewImageFiles({});
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setNewImageFiles({});
    setExistingImages({});
  };

  const handleCancelEdit = () => {
    resetForm();
    setActiveTab("list");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setUploadingImages(true);

    try {
      let finalImages: { url: string; type: ImageType }[] = [];

      // 1. Keep untouched existing images
      Object.entries(existingImages).forEach(([type, url]) => {
        if (url) finalImages.push({ url, type: type as ImageType });
      });

      // 2. Upload new files
      for (const type of IMAGE_TYPES) {
        const file = newImageFiles[type];
        if (file) {
          const formData = new FormData();
          formData.append("file", file);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) throw new Error(`Failed to upload ${type} image`);
          const data = await uploadRes.json();
          finalImages.push({ url: data.url, type });
        }
      }

      await upsertProduct({
        id: form.id || undefined,
        name: form.name.trim(),
        description: form.description.trim(),
        product_type_id: form.product_type_id || null,
        price: Number(form.price || 0),
        discount: Number(form.discount || 0),
        isActive: form.isActive,
        categoryIds: form.categoryIds,
        // Passing the typed object array instead of just an array of URL strings
        images: finalImages, 
      });

      toast.success(form.id ? "Product updated" : "Product created");
      resetForm();
      setActiveTab("list");
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setSaving(false);
      setUploadingImages(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this product and its related inventory/media?");
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      if (form.id === id) {
        resetForm();
        setActiveTab("list");
      }
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
    }
  };

  const productCards = products.map((product) => ({
    ...product,
    categories: (categoriesByProduct[product.id] ?? []).map((categoryId) => categoryMap[categoryId]).filter(Boolean),
    imagesCount: Object.keys(imagesByProduct[product.id] || {}).length,
    typeName: product.product_type_id ? typeMap[product.product_type_id] ?? "Unknown" : "Unassigned",
  }));

  const renderCategoryPlaceholder = () => {
    if (form.categoryIds.length === 0) return "Select categories...";
    if (form.categoryIds.length <= 2) {
      return form.categoryIds.map((id) => categoryMap[id]).filter(Boolean).join(", ");
    }
    return `${form.categoryIds.length} categories selected`;
  };

  return (
    <AdminShell
      title="Products"
      description="Manage your product catalog, pricing, media, and categorization."
      actions={
        <Button onClick={() => { resetForm(); setActiveTab("form"); }} className="gap-2">
          <Plus className="h-4 w-4" /> New product
        </Button>
      }
    >
      <div className="mb-6 inline-flex rounded-xl bg-black/5 p-1">
        <button onClick={() => setActiveTab("list")} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "list" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"}`}>
          <List className="h-4 w-4" /> Catalog List
        </button>
        <button onClick={() => setActiveTab("form")} className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "form" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"}`}>
          <Tag className="h-4 w-4" /> {form.id ? "Edit Product" : "Create Product"}
        </button>
      </div>

      <div className="grid gap-6">
        {activeTab === "form" && (
          <AdminPanel className="max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-black">{form.id ? "Edit product details" : "Add new product"}</h3>
                <p className="mt-1 text-sm text-black/60">Fill out the details below. Inventory is managed separately.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <fieldset disabled={saving} className="space-y-8 disabled:opacity-70 disabled:cursor-not-allowed">
                
                {/* 1. Basic Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-black border-b border-black/5 pb-2 uppercase tracking-wider">1. Basic Details</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="name" className="text-sm font-medium text-black">Name</label>
                      <Input id="name" name="name" type="text" value={form.name} placeholder="Vintage washed tee" required onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="description" className="text-sm font-medium text-black">Description</label>
                      <textarea id="description" name="description" value={form.description} placeholder="Short product description" onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))} className="min-h-28 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none transition-all placeholder:text-black/30 focus:border-black focus:ring-2 focus:ring-black/10" />
                    </div>
                  </div>
                </div>

                {/* 2. Organization */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-black border-b border-black/5 pb-2 uppercase tracking-wider">2. Organization</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="product_type_id" className="text-sm font-medium text-black">Product Type</label>
                      <div className="relative">
                        <select id="product_type_id" name="product_type_id" value={form.product_type_id} onChange={(e) => setForm((c) => ({ ...c, product_type_id: e.target.value }))} className="w-full appearance-none rounded-lg border border-black/10 bg-white px-3 py-2 pr-10 text-sm text-black outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                          <option value="">Select a product type</option>
                          {productTypes.map((type) => (<option key={type.id} value={type.id}>{type.name}</option>))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                      </div>
                    </div>
                    <div className="space-y-2 relative">
                      <label className="text-sm font-medium text-black">Categories</label>
                      <details className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10">
                          <span className="truncate pr-4 text-black/80">{renderCategoryPlaceholder()}</span>
                          <ChevronDown className="h-4 w-4 text-black/50 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-black/10 bg-white p-2 shadow-xl">
                          {categories.length === 0 ? (
                            <div className="p-2 text-sm text-black/50">No categories found.</div>
                          ) : (
                            categories.map((category) => {
                              const checked = form.categoryIds.includes(category.id);
                              return (
                                <label key={category.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm text-black transition-colors hover:bg-black/5">
                                  <input type="checkbox" checked={checked} onChange={() => setForm((c) => ({ ...c, categoryIds: checked ? c.categoryIds.filter((v) => v !== category.id) : [...c.categoryIds, category.id] }))} className="h-4 w-4 rounded border-border text-emerald-400" />
                                  {category.name}
                                </label>
                              );
                            })
                          )}
                        </div>
                      </details>
                    </div>
                  </div>
                </div>

                {/* 3. Pricing */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-black border-b border-black/5 pb-2 uppercase tracking-wider">3. Pricing</h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label htmlFor="price" className="text-sm font-medium text-black">Base Price</label>
                      <Input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="discount" className="text-sm font-medium text-black">Discount Amount</label>
                      <Input id="discount" name="discount" type="number" min="0" step="0.01" value={form.discount} onChange={(e) => setForm((c) => ({ ...c, discount: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="finalPrice" className="text-sm font-medium text-black">Final Price</label>
                      <Input id="finalPrice" name="finalPrice" type="text" value={formatCurrency(Math.max(0, Number(form.price || 0) - Number(form.discount || 0)))} readOnly className="bg-black/5 cursor-not-allowed font-semibold text-emerald-600" tabIndex={-1} />
                    </div>
                  </div>
                </div>

                {/* 4. Media & Visibility */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-black border-b border-black/5 pb-2 uppercase tracking-wider">4. Media & Visibility</h4>
                  
                  {/* Typed Image Dropzones */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {IMAGE_TYPES.map((type) => (
                      <div key={type} className="space-y-2 p-4 rounded-xl border border-black/10 bg-black/2 relative">
                        <label htmlFor={`image-${type}`} className="text-sm font-semibold text-black capitalize block mb-2">
                          {type.toLowerCase()} Image
                        </label>
                        <input
                          id={`image-${type}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setNewImageFiles(prev => ({ ...prev, [type]: file }));
                              // Remove from existing images so it gets replaced upon save
                              setExistingImages(prev => {
                                const updated = { ...prev };
                                delete updated[type];
                                return updated;
                              });
                            }
                          }}
                          className="w-full text-sm text-black/60 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-black/5 file:border file:border-black/10 transition-all cursor-pointer"
                        />
                        {/* File preview status */}
                        <div className="mt-2 text-xs">
                          {newImageFiles[type] ? (
                            <span className="text-emerald-600 font-medium truncate block">
                              Ready to upload: {newImageFiles[type]?.name}
                            </span>
                          ) : existingImages[type] ? (
                            <span className="text-black/50 truncate block">
                              Current: {existingImages[type]?.split('/').pop()}
                            </span>
                          ) : (
                            <span className="text-black/30 italic">No file selected</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 bg-black/5 p-4 rounded-xl border border-black/5 mt-4">
                    <input id="isActive" type="checkbox" checked={form.isActive} onChange={(e) => setForm((c) => ({ ...c, isActive: e.target.checked }))} className="h-5 w-5 rounded border-border text-emerald-500 focus:ring-emerald-500/30 cursor-pointer" />
                    <div>
                      <label htmlFor="isActive" className="text-sm font-semibold text-black cursor-pointer select-none block">Active Product</label>
                      <p className="text-xs text-black/60">If unchecked, the product will be hidden from the storefront.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-black/5">
                  <Button type="button" onClick={handleCancelEdit} className="bg-white text-black border border-black/10 hover:bg-black/5 shadow-none">Cancel</Button>
                  <Button type="submit" disabled={saving || uploadingImages} className="gap-2 px-8">
                    {uploadingImages ? "Uploading Media..." : saving ? "Saving..." : form.id ? "Save Changes" : "Create Product"}
                  </Button>
                </div>
              </fieldset>
            </form>
          </AdminPanel>
        )}

        {/* List Tab Logic (unchanged except for image count logic mapping) */}
        {activeTab === "list" && (
          <AdminPanel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-black">Product Directory</h3>
                <p className="mt-1 text-sm text-black/60">Manage and oversee all your catalog entries.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:inline-flex h-7 items-center rounded-full bg-black/5 px-3 text-xs font-medium text-black/70">
                  {products.length} {products.length === 1 ? 'item' : 'items'}
                </div>
                <button type="button" onClick={() => void reload()} className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black transition-colors hover:bg-black/5" disabled={loading}>
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin opacity-50" : ""}`} /> Refresh
                </button>
              </div>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-black/10 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black/10 text-left text-sm">
                  <thead className="bg-black/3 text-black">
                    <tr>
                      <th className="px-4 py-3 font-medium">Product</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Updated</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 bg-white">
                    {loading ? (
                      <tr><td className="px-4 py-8 text-black/50 text-center" colSpan={5}><div className="flex items-center justify-center gap-2"><RefreshCw className="h-4 w-4 animate-spin" /> Loading products...</div></td></tr>
                    ) : productCards.length === 0 ? (
                      <tr><td className="px-4 py-8 text-black/50 text-center" colSpan={5}>No products found. Create one to get started.</td></tr>
                    ) : (
                      productCards.map((product) => (
                        <tr key={product.id} className="align-top transition-colors hover:bg-black/2 group">
                          <td className="px-4 py-4">
                            <div className="font-medium text-black">{product.name}</div>
                            <div className="mt-1 text-xs font-semibold text-emerald-600">{product.typeName}</div>
                            <div className="mt-1 text-xs text-black/50">{product.categories.join(", ") || "No categories"}</div>
                            <div className="mt-1 text-xs text-black/40">{product.imagesCount} images attached</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-medium text-black">{formatCurrency(Number(product.final_price ?? product.price ?? 0))}</span>
                            {(product.discount ?? 0) > 0 && <div className="mt-1 text-xs text-black/40 line-through">{formatCurrency(Number(product.price ?? 0))}</div>}
                          </td>
                          <td className="px-4 py-4">
                            <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-black/10 text-black/60'}`}>
                              {product.is_active ? 'Active' : 'Draft'}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-black/60 whitespace-nowrap">{formatDateTime(product.updated_at as string)}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={() => beginEdit(product)} className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-black/5 hover:border-black/20 focus:ring-2 focus:ring-black/10 outline-none"><Edit3 className="h-3.5 w-3.5" /> Edit</button>
                              <button type="button" onClick={() => void handleDelete(product.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 hover:border-red-100 focus:ring-2 focus:ring-red-100 outline-none"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
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
        )}
      </div>
    </AdminShell>
  );
}