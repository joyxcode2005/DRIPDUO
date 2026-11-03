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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
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
      if (!accumulator[link.product_id]) accumulator[link.product_id] = [];
      accumulator[link.product_id].push(link.category_id);
      return accumulator;
    }, {});
  }, [productCategoryLinks]);

  // Group images by product ID, and then by their Type
  const imagesByProduct = useMemo(() => {
    return productImages.reduce<Record<string, string[]>>((accumulator, image) => {
      if (!accumulator[image.product_id]) accumulator[image.product_id] = [];
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
      isActive: product.is_active ?? true,
      categoryIds: categoriesByProduct[product.id] ?? [],
    });
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
      let uploadedUrls: string[] = [];
      
      // Upload multiple selected files sequentially
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
          if (!uploadRes.ok) throw new Error("Image upload failed for " + file.name);
          const data = await uploadRes.json();
          finalImages.push({ url: data.url, type });
        }
      }
      
      const existingUrls = (form.imageText || "").split("\n").map(url => url.trim()).filter(Boolean);
      const finalImageUrls = [...existingUrls, ...uploadedUrls];

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
    if (!window.confirm("Delete this product and its related inventory/media?")) return;
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
        <Button onClick={() => { resetForm(); setActiveTab("form"); }} className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 sm:py-2">
          <Plus className="h-4 w-4" /> New product
        </Button>
      }
    >
      <div className="mb-6 flex w-full sm:w-auto sm:inline-flex rounded-xl bg-black/5 p-1">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "list" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"}`}
        >
          <List className="h-4 w-4" /> Catalog List
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "form" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"}`}
        >
          <Tag className="h-4 w-4" /> {form.id ? "Edit Product" : "Create Product"}
        </button>
      </div>

      <div className="grid gap-6">
        {activeTab === "form" && (
          <AdminPanel>
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-black">{form.id ? "Edit product details" : "Add new product"}</h3>
                <p className="mt-1 text-sm text-black/60">Fill out the details below. Inventory is managed separately.</p>
                <h3 className="text-lg font-semibold text-black">{form.id ? "Edit product details" : "Add new product"}</h3>
                <p className="mt-1 text-sm text-black/60">Fill out the details below. Inventory is managed separately.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <fieldset disabled={saving} className="space-y-8 disabled:opacity-70 disabled:cursor-not-allowed">
                {/* 1. Basic Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-black/40 border-b border-black/5 pb-2 uppercase tracking-[0.24em]">1. Basic Details</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="name" className="text-sm font-medium text-black">Name</label>
                      <Input id="name" name="name" type="text" value={form.name} placeholder="Vintage washed tee" required onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} />
                      <Input id="name" name="name" type="text" value={form.name} placeholder="Vintage washed tee" required onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="description" className="text-sm font-medium text-black">Description</label>
                      <textarea id="description" name="description" value={form.description} placeholder="Short product description" onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))} className="min-h-[120px] w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none transition-all placeholder:text-black/30 focus:border-black focus:ring-2 focus:ring-black/10" />
                    </div>
                  </div>
                </div>

                {/* 2. Organization */}
                {/* 2. Organization */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-black/40 border-b border-black/5 pb-2 uppercase tracking-[0.24em]">2. Organization</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="product_type_id" className="text-sm font-medium text-black">Product Type</label>
                      <div className="relative">
                        <select id="product_type_id" name="product_type_id" value={form.product_type_id} onChange={(e) => setForm((c) => ({ ...c, product_type_id: e.target.value }))} className="w-full appearance-none rounded-lg border border-black/10 bg-white px-3 py-2.5 pr-10 text-sm text-black outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer">
                          <option value="">Select a product type</option>
                          {productTypes.map((type) => (<option key={type.id} value={type.id}>{type.name}</option>))}
                          {productTypes.map((type) => (<option key={type.id} value={type.id}>{type.name}</option>))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                      </div>
                    </div>
                    <div className="space-y-2 relative">
                      <label className="text-sm font-medium text-black">Categories</label>
                      <details className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-black outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10">
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
                                <label key={category.id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-black transition-colors hover:bg-black/5">
                                  <input type="checkbox" checked={checked} onChange={() => { setForm((c) => ({ ...c, categoryIds: checked ? c.categoryIds.filter((v) => v !== category.id) : [...c.categoryIds, category.id] })); }} className="h-4 w-4 rounded border-border text-emerald-400" />
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
                {/* 3. Pricing */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-black/40 border-b border-black/5 pb-2 uppercase tracking-[0.24em]">3. Pricing</h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label htmlFor="price" className="text-sm font-medium text-black">Base Price</label>
                      <Input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} />
                      <Input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="discount" className="text-sm font-medium text-black">Discount Amount</label>
                      <Input id="discount" name="discount" type="number" min="0" step="0.01" value={form.discount} onChange={(e) => setForm((c) => ({ ...c, discount: e.target.value }))} />
                      <Input id="discount" name="discount" type="number" min="0" step="0.01" value={form.discount} onChange={(e) => setForm((c) => ({ ...c, discount: e.target.value }))} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="finalPrice" className="text-sm font-medium text-black">Final Price</label>
                      <Input id="finalPrice" name="finalPrice" type="text" value={formatCurrency(Math.max(0, Number(form.price || 0) - Number(form.discount || 0)))} readOnly className="bg-black/5 cursor-not-allowed font-semibold text-emerald-600" tabIndex={-1} />
                      <Input id="finalPrice" name="finalPrice" type="text" value={formatCurrency(Math.max(0, Number(form.price || 0) - Number(form.discount || 0)))} readOnly className="bg-black/5 cursor-not-allowed font-semibold text-emerald-600" tabIndex={-1} />
                    </div>
                  </div>
                </div>

                {/* 4. Media & Visibility */}
                {/* 4. Media & Visibility */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-black/40 border-b border-black/5 pb-2 uppercase tracking-[0.24em]">4. Media & Visibility</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="images" className="text-sm font-medium text-black">Upload Images (Select Multiple)</label>
                      <input 
                        id="images" 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={(e) => { 
                          if (e.target.files) {
                            // Ensure we actually capture all selected files as an array
                            setImageFiles(Array.from(e.target.files)); 
                          }
                        }} 
                        className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none file:mr-4 file:rounded-md file:border-0 file:bg-black/5 file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:bg-black/10 transition-all focus:border-black focus:ring-2 focus:ring-black/10" 
                      />
                      {imageFiles.length > 0 && (
                        <div className="mt-2 text-xs text-black/60 flex flex-col gap-1 bg-black/5 p-3 rounded-lg border border-black/5">
                          <p className="font-semibold text-black/80 mb-1">Files selected to upload:</p>
                          {imageFiles.map((file, idx) => (<span key={idx}>• {file.name}</span>))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 sm:col-span-2 bg-black/5 p-4 rounded-xl border border-black/5 mt-2">
                      <input id="isActive" type="checkbox" checked={form.isActive} onChange={(e) => setForm((c) => ({ ...c, isActive: e.target.checked }))} className="h-5 w-5 rounded border-border text-emerald-500 focus:ring-emerald-500/30 cursor-pointer shrink-0" />
                      <div>
                        <label htmlFor="isActive" className="text-sm font-semibold text-black cursor-pointer select-none block">Active Product</label>
                        <p className="text-xs text-black/60 mt-0.5">If unchecked, the product will be hidden from the storefront.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-black/5">
                  <Button type="button" onClick={handleCancelEdit} className="w-full sm:w-auto bg-white text-black border border-black/10 hover:bg-black/5 shadow-none py-3 sm:py-2">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving || uploadingImages} className="w-full sm:w-auto gap-2 px-8 py-3 sm:py-2">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-semibold text-black">Product Directory</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:inline-flex text-sm text-black/60 shrink-0">{products.length} items</div>
                <button
                  type="button"
                  onClick={() => void reload()}
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-black/5"
                  disabled={loading}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin opacity-50" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-8 text-center text-sm text-black/50">Loading products...</div>
            ) : productCards.length === 0 ? (
              <div className="py-8 text-center text-sm text-black/50">No products found. Create one to get started.</div>
            ) : (
              <>
                {/* MOBILE VIEW: Cards */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {productCards.map((product) => (
                    <div key={product.id} className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div className="pr-3">
                          <div className="font-bold text-black text-base">{product.name}</div>
                          <div className="mt-0.5 text-xs font-semibold text-emerald-600">{product.typeName}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-black text-base">{formatCurrency(Number(product.final_price ?? product.price ?? 0))}</div>
                        </div>
                      </div>
                      <div className="mb-4 text-xs text-black/50 leading-relaxed">
                        {product.categories.join(", ") || "No categories"} • {product.images.length} media files attached
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-black/5">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold ${
                          product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-black/10 text-black/60'
                        }`}>
                          {product.is_active ? 'Active' : 'Draft'}
                        </span>
                        <div className="flex gap-2">
                          <button onClick={() => beginEdit(product)} className="p-2 border border-black/10 rounded-lg hover:bg-black/5">
                            <Edit3 className="h-4 w-4 text-black" />
                          </button>
                          <button onClick={() => void handleDelete(product.id)} className="p-2 border border-red-100 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESKTOP VIEW: Table */}
                <div className="hidden md:block overflow-hidden rounded-2xl border border-black/10 shadow-sm">
                  <table className="w-full divide-y divide-black/10 text-left text-sm">
                    <thead className="bg-black/3 text-black">
                      <tr>
                        <th className="px-4 py-3 font-medium">Product</th>
                        <th className="px-4 py-3 font-medium text-right">Price</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium text-right">Updated</th>
                        <th className="px-4 py-3 font-medium text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10 bg-white">
                      {productCards.map((product) => (
                        <tr key={product.id} className="align-top transition-colors hover:bg-black/2 group">
                          <td className="px-4 py-4 max-w-[250px]">
                            <div className="font-medium text-black truncate">{product.name}</div>
                            <div className="mt-1 text-xs font-semibold text-emerald-600">{product.typeName}</div>
                            <div className="mt-1 text-xs text-black/50 truncate" title={product.categories.join(", ")}>{product.categories.join(", ") || "No categories"}</div>
                            <div className="mt-1 text-xs text-black/40">{product.images.length} images attached</div>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className="font-medium text-black">{formatCurrency(Number(product.final_price ?? product.price ?? 0))}</span>
                            {(product.discount ?? 0) > 0 && <div className="mt-1 text-xs text-black/40 line-through">{formatCurrency(Number(product.price ?? 0))}</div>}
                          </td>
                          <td className="px-4 py-4">
                            <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-black/10 text-black/60'}`}>
                            <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${product.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-black/10 text-black/60'}`}>
                              {product.is_active ? 'Active' : 'Draft'}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-black/60 whitespace-nowrap text-right">{formatDateTime(product.updated_at as string)}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <button onClick={() => beginEdit(product)} className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium text-black transition-colors hover:bg-black/5 outline-none">
                                <Edit3 className="h-3.5 w-3.5" /> Edit
                              </button>
                              <button onClick={() => void handleDelete(product.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 outline-none">
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </AdminPanel>
        )}
      </div>
    </AdminShell>
  );
}