"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Edit3, Plus, RefreshCw, Trash2 } from "lucide-react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import AdminShell, { AdminPanel } from "@/components/admin/AdminShell";
import { ProductRow, ProductVariantRow, deleteVariant, getProducts, getVariants, upsertVariant } from "@/services/admin";

const emptyForm = {
  id: "",
  product_id: "",
  size: "",
  stock: "0",
  gsm: "0",
};

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [variants, setVariants] = useState<ProductVariantRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const reload = async () => {
    setLoading(true);

    try {
      const [productData, variantData] = await Promise.all([getProducts(), getVariants()]);
      setProducts(productData);
      setVariants(variantData);
      setForm((current) => ({
        ...current,
        product_id: current.product_id || productData[0]?.id || "",
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const productMap = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product.name])),
    [products]
  );

  const beginEdit = (variant: ProductVariantRow) => {
    setForm({
      id: variant.id,
      product_id: variant.product_id,
      size: variant.size,
      stock: String(variant.stock),
      gsm: String(variant.gsm ?? 0),
    });
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
      product_id: products[0]?.id ?? "",
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      await upsertVariant({
        id: form.id || undefined,
        product_id: form.product_id,
        size: form.size.trim(),
        stock: Number(form.stock || 0),
        gsm: Number(form.gsm || 0),
      });
      toast.success(form.id ? "Variant updated" : "Variant created");
      resetForm();
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save variant");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this inventory variant?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteVariant(id);
      toast.success("Variant deleted");
      if (form.id === id) {
        resetForm();
      }
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete variant");
    }
  };

  const groupedVariants = useMemo(() => {
    return variants.reduce<Record<string, ProductVariantRow[]>>((accumulator, variant) => {
      if (!accumulator[variant.product_id]) {
        accumulator[variant.product_id] = [];
      }

      accumulator[variant.product_id].push(variant);
      return accumulator;
    }, {});
  }, [variants]);

  return (
    <AdminShell
      title="Inventory"
      description="Keep size and stock data separate from product pricing so restocks stay focused."
      actions={
        <Button onClick={resetForm} className="gap-2">
          <Plus className="h-4 w-4" />
          New variant
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <AdminPanel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-black">Variant form</h3>
              <p className="mt-1 text-sm text-black/60">Attach a size, stock count, and GSM to a product.</p>
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
                <label htmlFor="product_id" className="text-sm font-medium text-black">Product</label>
              <select
                id="product_id"
                value={form.product_id}
                onChange={(event) => setForm((current) => ({ ...current, product_id: event.target.value }))}
                className="flex h-10 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-black outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="size" className="text-sm font-medium text-black">Size</label>
                <Input
                  id="size"
                  name="size"
                  type="text"
                  value={form.size}
                  placeholder="M / L / XL"
                  required
                  onChange={(event) => setForm((current) => ({ ...current, size: event.target.value }))}
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
                <label htmlFor="gsm" className="text-sm font-medium text-black">GSM</label>
                <Input
                  id="gsm"
                  name="gsm"
                  type="number"
                  min="0"
                  value={form.gsm}
                  onChange={(event) => setForm((current) => ({ ...current, gsm: event.target.value }))}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={saving} className="gap-2">
                <Edit3 className="h-4 w-4" />
                {saving ? "Saving..." : form.id ? "Update variant" : "Create variant"}
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
              <h3 className="text-lg font-semibold text-white">Inventory list</h3>
              <p className="mt-1 text-sm text-black/60">Review all sizes and stock levels across products.</p>
            </div>
            <div className="text-sm text-black/60">{variants.length} variants</div>
          </div>

          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/60">Loading inventory...</div>
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-white p-6 text-black/60">Create a product first, then assign inventory variants.</div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="overflow-hidden rounded-2xl border border-black/10">
                  <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-black/5 px-4 py-3">
                    <div>
                      <div className="font-medium text-black">{product.name}</div>
                      <div className="text-xs text-black/60">{groupedVariants[product.id]?.length ?? 0} variants</div>
                    </div>
                  </div>
                  <div className="divide-y divide-black/10 bg-white">
                    {(groupedVariants[product.id] ?? []).length === 0 ? (
                      <div className="px-4 py-4 text-sm text-black/60">No variants for this product yet.</div>
                    ) : (
                      groupedVariants[product.id].map((variant) => (
                        <div key={variant.id} className="flex items-center justify-between gap-3 px-4 py-4 text-sm">
                          <div>
                            <div className="font-medium text-black">{variant.size}</div>
                            <div className="mt-1 text-xs text-black/60">Stock: {variant.stock} | GSM: {variant.gsm ?? "—"}</div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => beginEdit(variant)}
                              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black transition-colors hover:bg-black/5"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDelete(variant.id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black transition-colors hover:bg-black/5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
