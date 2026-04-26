"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Edit3, Plus, RefreshCw, Trash2 } from "lucide-react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import AdminShell, { AdminPanel } from "@/components/admin/AdminShell";
import { formatDateTime, slugify } from "@/utils/admin";
import { CategoryRow, deleteCategory, getCategories, upsertCategory } from "@/services/admin";

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  isActive: true,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);

    try {
      setCategories(await getCategories());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const categoryCount = useMemo(() => categories.length, [categories.length]);

  const beginEdit = (category: CategoryRow) => {
    setForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      isActive: category.isActive,
    });
  };

  const resetForm = () => setForm(emptyForm);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      await upsertCategory({
        id: form.id || undefined,
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        isActive: form.isActive,
      });
      toast.success(form.id ? "Category updated" : "Category created");
      resetForm();
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this category and remove its product links?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      if (form.id === id) {
        resetForm();
      }
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
    }
  };

  return (
    <AdminShell
      title="Categories"
      description="Keep your collection structure tidy, active, and ready to assign inside product forms."
      actions={
        <Button onClick={resetForm} className="gap-2">
          <Plus className="h-4 w-4" />
          New category
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <AdminPanel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-black">Category form</h3>
              <p className="mt-1 text-sm text-black/60">Maintain names and slugs without leaving the dashboard.</p>
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
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-black">Name</label>
              <Input
                id="name"
                name="name"
                type="text"
                value={form.name}
                placeholder="Summer drops"
                required
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                    slug: current.slug ? current.slug : slugify(event.target.value),
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium text-black">Slug</label>
              <Input
                id="slug"
                name="slug"
                type="text"
                value={form.slug}
                placeholder="summer-drops"
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                id="isActive"
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                className="h-4 w-4 rounded border-border text-emerald-400 focus:ring-emerald-400/30"
              />
              <label htmlFor="isActive" className="text-sm text-black">Active category</label>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={saving} className="gap-2">
                <Edit3 className="h-4 w-4" />
                {saving ? "Saving..." : form.id ? "Update category" : "Create category"}
              </Button>
              <Button type="button" onClick={resetForm} className="bg-white/10 hover:bg-white/15">
                Clear form
              </Button>
            </div>
          </form>
        </AdminPanel>

        <AdminPanel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-white">Category list</h3>
              <p className="mt-1 text-sm text-black/60">Use this list to keep product filters organized.</p>
            </div>
            <div className="text-sm text-black/60">{categoryCount} items</div>
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
                  {loading ? (
                    <tr>
                      <td className="px-4 py-6 text-black/60" colSpan={4}>Loading categories...</td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-black/60" colSpan={4}>No categories yet.</td>
                    </tr>
                  ) : (
                    categories.map((category) => (
                      <tr key={category.id}>
                        <td className="px-4 py-4 text-black">{category.name}</td>
                        <td className="px-4 py-4 text-black/60">{category.slug}</td>
                        <td className="px-4 py-4 text-black">{category.isActive ? "Active" : "Disabled"}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => beginEdit(category)}
                              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black transition-colors hover:bg-black/5"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(category.id)}
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

          <p className="mt-4 text-sm text-black/60">Updated at: {formatDateTime(categories[0]?.slug ? new Date().toISOString() : null)}</p>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
