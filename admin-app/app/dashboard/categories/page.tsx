"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Edit3, Plus, RefreshCw, Trash2, FolderTree, Tags } from "lucide-react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import AdminShell, { AdminPanel } from "@/components/admin/AdminShell";
import { slugify } from "@/utils/admin";

// --- EXISTING CATEGORY SERVICES ---
import { deleteCategory, getCategories, upsertCategory, upsertProductType, getProductTypes } from "@/services/admin";
import { CategoryRow, ProductTypeRow } from "@/types";


const deleteProductType = async (id: string) => { };

const emptyCategoryForm = { id: "", name: "", slug: "", isActive: true };
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
      console.log("Loaded categories:", categories);
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
        <div className="flex bg-black/5 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "categories" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"
              }`}
          >
            <FolderTree className="h-4 w-4" />
            Categories
          </button>
          <button
            onClick={() => setActiveTab("types")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "types" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"
              }`}
          >
            <Tags className="h-4 w-4" />
            Product Types
          </button>
        </div>
      }
    >
      {activeTab === "categories" && (
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <AdminPanel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-black">Category form</h3>
                <p className="mt-1 text-sm text-black/60">Maintain names and slugs.</p>
              </div>
              <button
                type="button"
                onClick={() => void reloadCategories()}
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black transition-colors hover:bg-black/5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleCatSubmit}>
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
              <div className="flex items-center gap-3">
                <input
                  id="cat-isActive"
                  type="checkbox"
                  checked={catForm.isActive}
                  onChange={(e) => setCatForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-border text-emerald-400 focus:ring-emerald-400/30"
                />
                <label htmlFor="cat-isActive" className="text-sm text-black">Active category</label>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={savingCat} className="gap-2">
                  {catForm.id ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {savingCat ? "Saving..." : catForm.id ? "Update category" : "Create category"}
                </Button>
                <Button type="button" onClick={resetCatForm} className="bg-white/10 hover:bg-white/15">
                  Clear form
                </Button>
              </div>
            </form>
          </AdminPanel>

          <AdminPanel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-black">Category list</h3>
              </div>
              <div className="text-sm text-black/60">{categories.length} items</div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-black/10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black/10 text-left text-sm">
                  <thead className="bg-black/5 text-black">
                    <tr>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Slug</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 bg-white">
                    {loadingCats ? (
                      <tr><td className="px-4 py-6 text-black/60" colSpan={4}>Loading...</td></tr>
                    ) : categories.length === 0 ? (
                      <tr><td className="px-4 py-6 text-black/60" colSpan={4}>No categories yet.</td></tr>
                    ) : (
                      categories.map((category) => (
                        <tr key={category.id}>
                          <td className="px-4 py-4 text-black/60">{category.slug}</td>
                          <td className="px-4 py-4 text-black">{category.is_active ? "Active" : "Disabled"}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => setCatForm({ id: category.id, name: category.name, slug: category.slug, isActive: category.is_active })} className="p-2 border rounded-xl hover:bg-black/5">
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleCatDelete(category.id)} className="p-2 border rounded-xl hover:bg-black/5">
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
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <AdminPanel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-black">Product Type form</h3>
                <p className="mt-1 text-sm text-black/60">Manage base product types (e.g. T-Shirt, Mug).</p>
              </div>
              <button
                type="button"
                onClick={() => void reloadTypes()}
                className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black transition-colors hover:bg-black/5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleTypeSubmit}>
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
              <div className="flex items-center gap-3">
                <input
                  id="type-isActive"
                  type="checkbox"
                  checked={typeForm.isActive}
                  onChange={(e) => setTypeForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-border text-emerald-400 focus:ring-emerald-400/30"
                />
                <label htmlFor="type-isActive" className="text-sm text-black">Active Type</label>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={savingType} className="gap-2">
                  {typeForm.id ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {savingType ? "Saving..." : typeForm.id ? "Update Type" : "Create Type"}
                </Button>
                <Button type="button" onClick={resetTypeForm} className="bg-white/10 hover:bg-white/15">
                  Clear form
                </Button>
              </div>
            </form>
          </AdminPanel>

          <AdminPanel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-black">Product Type list</h3>
              </div>
              <div className="text-sm text-black/60">{productTypes.length} items</div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-black/10">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-black/10 text-left text-sm">
                  <thead className="bg-black/5 text-black">
                    <tr>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Slug</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10 bg-white">
                    {loadingTypes ? (
                      <tr><td className="px-4 py-6 text-black/60" colSpan={4}>Loading...</td></tr>
                    ) : productTypes.length === 0 ? (
                      <tr><td className="px-4 py-6 text-black/60" colSpan={4}>No product types yet.</td></tr>
                    ) : (
                      productTypes.map((type) => (
                        <tr key={type.id}>
                          <td className="px-4 py-4 text-black/60">{type.slug}</td>
                          <td className="px-4 py-4 text-black">{type.is_active ? "Active" : "Disabled"}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => setTypeForm({ id: type.id, name: type.name, slug: type.slug, isActive: type.is_active })} className="p-2 border rounded-xl hover:bg-black/5">
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button onClick={() => handleTypeDelete(type.id)} className="p-2 border rounded-xl hover:bg-black/5">
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