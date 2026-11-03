"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Edit3, Plus, RefreshCw, Trash2, FolderTree, Tags } from "lucide-react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import AdminShell, { AdminPanel } from "@/components/admin/AdminShell";
import { slugify } from "@/utils/admin";

import { deleteCategory, getCategories, upsertCategory, upsertProductType, getProductTypes } from "@/services/admin";
import { CategoryRow, ProductTypeRow } from "@/types";

const deleteProductType = async (id: string) => { };

const emptyCategoryForm = { id: "", name: "", slug: "", isActive: true, parentId: "" };
const emptyTypeForm = { id: "", name: "", slug: "", isActive: true };

type TabMode = "categories" | "types";

export default function TaxonomyPage() {
  const [activeTab, setActiveTab] = useState<TabMode>("categories");
  
  // --- CATEGORY STATE ---
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [catForm, setCatForm] = useState(emptyCategoryForm);
  const [loadingCats, setLoadingCats] = useState(true);
  const [savingCat, setSavingCat] = useState(false);

  // --- PRODUCT TYPE STATE ---
  const [productTypes, setProductTypes] = useState<ProductTypeRow[]>([]);
  const [typeForm, setTypeForm] = useState(emptyTypeForm);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [savingType, setSavingType] = useState(false);

  // --- LOADERS ---
  const reloadCategories = async () => {
    setLoadingCats(true);
    try {
      setCategories(await getCategories());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load categories");
    } finally {
      setLoadingCats(false);
    }
  };

  const reloadTypes = async () => {
    setLoadingTypes(true);
    try {
      setProductTypes(await getProductTypes());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load product types");
    } finally {
      setLoadingTypes(false);
    }
  };

  useEffect(() => {
    void reloadCategories();
    void reloadTypes();
  }, []);

  // --- HANDLERS: CATEGORIES ---
  const resetCatForm = () => setCatForm(emptyCategoryForm);
  
  const handleCatSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingCat(true);
    try {
      await upsertCategory({
        id: catForm.id || undefined,
        name: catForm.name.trim(),
        slug: catForm.slug.trim() || slugify(catForm.name),
        isActive: catForm.isActive,
        parentId: catForm.parentId || null, 
      });
      toast.success(catForm.id ? "Category updated" : "Category created");
      resetCatForm();
      await reloadCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save category");
    } finally {
      setSavingCat(false);
    }
  };

  const handleCatDelete = async (id: string) => {
    if (!window.confirm("Delete this category and remove its product links?")) return;
    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      if (catForm.id === id) resetCatForm();
      await reloadCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
    }
  };

  // --- HANDLERS: PRODUCT TYPES ---
  const resetTypeForm = () => setTypeForm(emptyTypeForm);
  
  const handleTypeSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingType(true);
    try {
      await upsertProductType({
        id: typeForm.id || undefined,
        name: typeForm.name.trim(),
        slug: typeForm.slug.trim() || slugify(typeForm.name),
        isActive: typeForm.isActive,
      });
      toast.success(typeForm.id ? "Product Type updated" : "Product Type created");
      resetTypeForm();
      await reloadTypes();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save product type");
    } finally {
      setSavingType(false);
    }
  };

  const handleTypeDelete = async (id: string) => {
    if (!window.confirm("Delete this product type?")) return;
    try {
      await deleteProductType(id);
      toast.success("Product Type deleted");
      if (typeForm.id === id) resetTypeForm();
      await reloadTypes();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product type");
    }
  };

  return (
    <AdminShell
      title="Taxonomy & Structure"
      description="Keep your collection categories and product types tidy and ready to assign."
      actions={
        <div className="flex w-full sm:w-auto bg-black/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "categories" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"}`}
          >
            <FolderTree className="h-4 w-4" /> Categories
          </button>
          <button
            onClick={() => setActiveTab("types")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "types" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"}`}
          >
            <Tags className="h-4 w-4" /> Types
          </button>
        </div>
      }
    >
      {activeTab === "categories" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] xl:grid-cols-[0.92fr_1.08fr]">
          <AdminPanel>
            <div className="flex items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-black">Category form</h3>
                <p className="mt-1 text-sm text-black/60">Maintain names, slugs, and hierarchy.</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleCatSubmit}>
              <div className="space-y-2">
                <label htmlFor="cat-name" className="text-sm font-medium text-black">Name</label>
                <Input
                  name="cat-name"
                  id="cat-name"
                  type="text"
                  value={catForm.name}
                  placeholder="Summer drops"
                  required
                  onChange={(e) =>
                    setCatForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: prev.slug ? prev.slug : slugify(e.target.value),
                    }))
                  }
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cat-slug" className="text-sm font-medium text-black">Slug</label>
                <Input
                  name="cat-slug"
                  id="cat-slug"
                  type="text"
                  value={catForm.slug}
                  placeholder="summer-drops"
                  onChange={(e) => setCatForm((prev) => ({ ...prev, slug: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="cat-parent" className="text-sm font-medium text-black">Parent Category (Optional)</label>
                <select
                  id="cat-parent"
                  value={catForm.parentId}
                  onChange={(e) => setCatForm((prev) => ({ ...prev, parentId: e.target.value }))}
                  className="w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-black focus:border-black/30 focus:outline-none focus:ring-1 focus:ring-black/30"
                >
                  <option value="">None (Top-level Category)</option>
                  {categories
                    .filter((c) => c.id !== catForm.id) 
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  id="cat-isActive"
                  type="checkbox"
                  checked={catForm.isActive}
                  onChange={(e) => setCatForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-5 w-5 rounded border-border text-emerald-400 focus:ring-emerald-400/30 cursor-pointer"
                />
                <label htmlFor="cat-isActive" className="text-sm font-medium text-black cursor-pointer select-none">Active category</label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row flex-wrap gap-3 pt-4 border-t border-black/5 mt-4">
                <Button type="button" onClick={resetCatForm} className="w-full sm:w-auto bg-white text-black border border-black/10 hover:bg-black/5 shadow-none">
                  Clear form
                </Button>
                <Button type="submit" disabled={savingCat} className="w-full sm:w-auto gap-2">
                  {catForm.id ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {savingCat ? "Saving..." : catForm.id ? "Update category" : "Create category"}
                </Button>
              </div>
            </form>
          </AdminPanel>

          <AdminPanel>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-semibold text-black">Category list</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:inline-flex text-sm text-black/60 shrink-0">{categories.length} items</div>
                <button
                  type="button"
                  onClick={() => void reloadCategories()}
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-black/5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingCats ? "animate-spin opacity-50" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* CATEGORY MOBILE VIEW: Cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {loadingCats ? (
                <div className="p-4 text-center text-sm text-black/60">Loading...</div>
              ) : categories.length === 0 ? (
                <div className="p-4 text-center text-sm text-black/60">No categories yet.</div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="p-4 bg-white border border-black/10 rounded-xl shadow-sm">
                    <div className="font-bold text-black text-base">{category.name}</div>
                    <div className="text-xs text-black/50 mt-1">Parent: {category.parent_id ? categories.find(c => c.id === category.parent_id)?.name || "Unknown" : "None"}</div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider ${category.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-black/10 text-black/60'}`}>
                        {category.is_active ? 'Active' : 'Disabled'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCatForm({ id: category.id, name: category.name, slug: category.slug, isActive: category.is_active, parentId: category.parent_id || "" })}
                          className="p-2 border border-black/10 rounded-lg hover:bg-black/5"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleCatDelete(category.id)}
                          className="p-2 border border-red-100 text-red-600 rounded-lg bg-red-50 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* CATEGORY DESKTOP VIEW: Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-black/10">
              <div className="overflow-x-auto">
                <table className="min-w-[600px] w-full divide-y divide-black/10 text-left text-sm">
                  <thead className="bg-black/5 text-black">
                    <tr>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Parent</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 bg-white">
                    {loadingCats ? (
                      <tr><td className="px-4 py-6 text-black/60 text-center" colSpan={4}>Loading...</td></tr>
                    ) : categories.length === 0 ? (
                      <tr><td className="px-4 py-6 text-black/60 text-center" colSpan={4}>No categories yet.</td></tr>
                    ) : (
                      categories.map((category) => (
                        <tr key={category.id} className="transition-colors hover:bg-black/2 group">
                          <td className="px-4 py-4 text-black font-medium">{category.name}</td>
                          <td className="px-4 py-4 text-black/60 text-xs">
                            {category.parent_id 
                              ? categories.find(c => c.id === category.parent_id)?.name || "Unknown"
                              : "—"}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${category.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-black/10 text-black/60'}`}>
                                {category.is_active ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() =>
                                  setCatForm({
                                    id: category.id,
                                    name: category.name,
                                    slug: category.slug,
                                    isActive: category.is_active,
                                    parentId: category.parent_id || "", 
                                  })
                                }
                                className="p-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors focus:ring-2 focus:ring-black/10 outline-none"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleCatDelete(category.id)} className="p-2 border border-transparent rounded-xl hover:bg-red-50 text-red-600 transition-colors focus:ring-2 focus:ring-red-100 outline-none">
                                <Trash2 className="h-3.5 w-3.5" />
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
      )}

      {activeTab === "types" && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] xl:grid-cols-[0.92fr_1.08fr]">
          <AdminPanel>
            <div className="flex items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-black">Product Type form</h3>
                <p className="mt-1 text-sm text-black/60">Manage base product types.</p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleTypeSubmit}>
              <div className="space-y-2">
                <label htmlFor="type-name" className="text-sm font-medium text-black">Name</label>
                <Input
                  name="type-name"
                  id="type-name"
                  type="text"
                  value={typeForm.name}
                  placeholder="T-Shirt"
                  required
                  onChange={(e) =>
                    setTypeForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                      slug: prev.slug ? prev.slug : slugify(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="type-slug" className="text-sm font-medium text-black">Slug</label>
                <Input
                  name="type-slug"
                  id="type-slug"
                  type="text"
                  value={typeForm.slug}
                  placeholder="t-shirt"
                  onChange={(e) => setTypeForm((prev) => ({ ...prev, slug: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input
                  id="type-isActive"
                  type="checkbox"
                  checked={typeForm.isActive}
                  onChange={(e) => setTypeForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-5 w-5 rounded border-border text-emerald-400 focus:ring-emerald-400/30 cursor-pointer"
                />
                <label htmlFor="type-isActive" className="text-sm font-medium text-black cursor-pointer select-none">Active Type</label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row flex-wrap gap-3 pt-4 border-t border-black/5 mt-4">
                <Button type="button" onClick={resetTypeForm} className="w-full sm:w-auto bg-white text-black border border-black/10 hover:bg-black/5 shadow-none">
                  Clear form
                </Button>
                <Button type="submit" disabled={savingType} className="w-full sm:w-auto gap-2">
                  {typeForm.id ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {savingType ? "Saving..." : typeForm.id ? "Update Type" : "Create Type"}
                </Button>
              </div>
            </form>
          </AdminPanel>

          <AdminPanel>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h3 className="text-lg font-semibold text-black">Product Type list</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:inline-flex text-sm text-black/60 shrink-0">{productTypes.length} items</div>
                <button
                  type="button"
                  onClick={() => void reloadTypes()}
                  className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black transition-colors hover:bg-black/5"
                  disabled={loadingTypes}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingTypes ? "animate-spin opacity-50" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* TYPES MOBILE VIEW: Cards */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {loadingTypes ? (
                <div className="p-4 text-center text-sm text-black/60">Loading...</div>
              ) : productTypes.length === 0 ? (
                <div className="p-4 text-center text-sm text-black/60">No product types yet.</div>
              ) : (
                productTypes.map((type) => (
                  <div key={type.id} className="p-4 bg-white border border-black/10 rounded-xl shadow-sm">
                    <div className="font-bold text-black text-base">{type.name}</div>
                    <div className="text-xs text-black/50 mt-1">Slug: {type.slug}</div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider ${type.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-black/10 text-black/60'}`}>
                        {type.is_active ? 'Active' : 'Disabled'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTypeForm({ id: type.id, name: type.name, slug: type.slug, isActive: type.is_active })}
                          className="p-2 border border-black/10 rounded-lg hover:bg-black/5"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleTypeDelete(type.id)}
                          className="p-2 border border-red-100 text-red-600 rounded-lg bg-red-50 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* TYPES DESKTOP VIEW: Table */}
            <div className="hidden md:block overflow-hidden rounded-2xl border border-black/10">
              <div className="overflow-x-auto">
                <table className="min-w-[500px] w-full divide-y divide-black/10 text-left text-sm">
                  <thead className="bg-black/5 text-black">
                    <tr>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Slug</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 bg-white">
                    {loadingTypes ? (
                      <tr><td className="px-4 py-6 text-black/60 text-center" colSpan={4}>Loading...</td></tr>
                    ) : productTypes.length === 0 ? (
                      <tr><td className="px-4 py-6 text-black/60 text-center" colSpan={4}>No product types yet.</td></tr>
                    ) : (
                      productTypes.map((type) => (
                        <tr key={type.id} className="transition-colors hover:bg-black/2 group">
                          <td className="px-4 py-4 text-black font-medium">{type.name}</td>
                          <td className="px-4 py-4 text-black/60">{type.slug}</td>
                          <td className="px-4 py-4">
                             <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${type.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-black/10 text-black/60'}`}>
                                {type.is_active ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              <button onClick={() => setTypeForm({ id: type.id, name: type.name, slug: type.slug, isActive: type.is_active })} className="p-2 border border-black/10 rounded-xl hover:bg-black/5 transition-colors focus:ring-2 focus:ring-black/10 outline-none">
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleTypeDelete(type.id)} className="p-2 border border-transparent rounded-xl hover:bg-red-50 text-red-600 transition-colors focus:ring-2 focus:ring-red-100 outline-none">
                                <Trash2 className="h-3.5 w-3.5" />
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
      )}
    </AdminShell>
  );
}