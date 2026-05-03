"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Edit3, Plus, RefreshCw, Trash2, ChevronDown, Package, List, Tag } from "lucide-react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import AdminShell, { AdminPanel } from "@/components/admin/AdminShell";
import { deleteVariant, getCategories, getProducts, getVariants, upsertVariant } from "@/services/admin";
import { ProductRow, ProductVariantRow } from "@/types";

const AVAILABLE_GSMS = ["180", "210", "230", "240"];
const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

const emptyForm = {
  id: "",
  product_id: "",
  variants: [
    { gsm: "", size: "", stock: "0" }
  ],
};

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");

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

  // --- ROW MANAGEMENT HELPERS ---
  const addVariantRow = () => {
    setForm((curr) => ({
      ...curr,
      variants: [...curr.variants, { gsm: "", size: "", stock: "0" }],
    }));
  };

  const removeVariantRow = (index: number) => {
    setForm((curr) => ({
      ...curr,
      variants: curr.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariantRow = (index: number, field: string, value: string) => {
    setForm((curr) => {
      const newVariants = [...curr.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...curr, variants: newVariants };
    });
  };

  const beginEdit = (variant: ProductVariantRow) => {
    setForm({
      id: variant.id,
      product_id: variant.product_id,
      variants: [{
        gsm: variant.gsm ? String(variant.gsm) : "",
        size: variant.size,
        stock: String(variant.stock),
      }],
    });
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm((current) => ({
      ...emptyForm,
      product_id: current.product_id || products[0]?.id || "",
    }));
  };

  const handleCancelEdit = () => {
    resetForm();
    setActiveTab("list");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate that all rows have required selections
    for (const v of form.variants) {
      if (!v.size || !v.gsm) {
        return toast.error("Please complete GSM and Size for all variants.");
      }
    }

    setSaving(true);

    try {
      if (form.id) {
        // EDIT MODE: Update single variant
        const v = form.variants[0];
        await upsertVariant({
          id: form.id,
          product_id: form.product_id,
          size: v.size,
          stock: Number(v.stock || 0),
          gsm: v.gsm,
        } as any); // Remove 'as any' once your backend types are updated
        toast.success("Variant updated successfully");
      } else {
        // BULK CREATE MODE: Process all rows dynamically
        const promises = form.variants.map((v) => {
          // Check if this exact variant already exists in the local state
          const existingVariant = variants.find(
            (ext) => ext.product_id === form.product_id && ext.size === v.size && String(ext.gsm) === v.gsm
          );

          const newStockAmount = Number(v.stock || 0);
          const finalStock = existingVariant
            ? (existingVariant.stock || 0) + newStockAmount
            : newStockAmount;

          return upsertVariant({
            id: existingVariant?.id, // Passing the ID forces an UPDATE instead of an INSERT
            product_id: form.product_id,
            size: v.size,
            stock: finalStock,
            gsm: v.gsm,
          } as any); // Remove 'as any' once your backend types are updated
        });

        await Promise.all(promises);
        toast.success(`Processed ${promises.length} variant configuration${promises.length > 1 ? 's' : ''}!`);
      }

      resetForm();
      setActiveTab("list");
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save variant(s)");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this inventory variant? This will update the main product stock.");

    if (!confirmed) return;

    try {
      await deleteVariant(id);
      toast.success("Variant deleted");
      if (form.id === id) {
        resetForm();
        setActiveTab("list");
      }
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete variant");
    }
  };

  const groupedVariants = useMemo(() => {
    return variants.reduce<Record<string, ProductVariantRow[]>>((accumulator, variant) => {
      if (!accumulator[variant.product_id]) accumulator[variant.product_id] = [];
      accumulator[variant.product_id].push(variant);
      return accumulator;
    }, {});
  }, [variants]);

  return (
    <AdminShell
      title="Inventory"
      description="Manage sizes, GSM types, categories, and stock amounts. Add multiple variant configurations at once."
      actions={
        <Button
          onClick={() => {
            resetForm();
            setActiveTab("form");
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New variant
        </Button>
      }
    >
      {/* Tabs Navigation */}
      <div className="mb-6 inline-flex rounded-xl bg-black/5 p-1">
        <button
          onClick={() => setActiveTab("list")}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "list" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"
            }`}
        >
          <List className="h-4 w-4" />
          Stock Directory
        </button>
        <button
          onClick={() => {
            if (!form.id) resetForm();
            setActiveTab("form");
          }}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "form" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"
            }`}
        >
          <Tag className="h-4 w-4" />
          {form.id ? "Edit Variant" : "Manage Variants"}
        </button>
      </div>

      <div className="grid gap-6">
        {/* --- FORM TAB --- */}
        {activeTab === "form" && (
          <AdminPanel className="max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-black">
                  {form.id ? "Edit Variant" : "Add Variants"}
                </h3>
                <p className="mt-1 text-sm text-black/60">
                  {form.id ? "Update the configuration or stock." : "Select the target product and add multiple specific variants below."}
                </p>
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <fieldset disabled={saving} className="space-y-6 disabled:opacity-70 disabled:cursor-not-allowed">

                <div className="space-y-2">
                  <label htmlFor="product_id" className="text-sm font-medium text-black">Target Product</label>
                  <div className="relative">
                    <select
                      id="product_id"
                      value={form.product_id}
                      required
                      onChange={(event) => setForm((current) => ({ ...current, product_id: event.target.value }))}
                      className="w-full appearance-none rounded-lg border border-black/10 bg-white px-3 py-2 pr-10 text-sm text-black outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer"
                    >
                      {products.length === 0 && <option value="">No products available</option>}
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                  </div>
                </div>

                {/* DYNAMIC VARIANT ROWS */}
                <div className="space-y-4 border-t border-black/5 pt-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-black">Variant Configurations</label>
                  </div>

                  {form.variants.map((v, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-end border border-black/10 p-4 rounded-xl bg-black/2 relative transition-all">

                      {/* GSM Dropdown */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-black/70">GSM</label>
                        <div className="relative">
                          <select
                            value={v.gsm}
                            required
                            onChange={(e) => updateVariantRow(index, "gsm", e.target.value)}
                            className="w-full appearance-none rounded-lg border border-black/10 bg-white px-3 py-2 pr-8 text-sm text-black outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer"
                          >
                            <option value="" disabled>Select...</option>
                            {AVAILABLE_GSMS.map(g => <option key={g} value={g}>{g} GSM</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/50" />
                        </div>
                      </div>

                      {/* Size Dropdown */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-black/70">Size</label>
                        <div className="relative">
                          <select
                            value={v.size}
                            required
                            onChange={(e) => updateVariantRow(index, "size", e.target.value)}
                            className="w-full appearance-none rounded-lg border border-black/10 bg-white px-3 py-2 pr-8 text-sm text-black outline-none transition-all focus:border-black focus:ring-2 focus:ring-black/10 cursor-pointer"
                          >
                            <option value="" disabled>Select...</option>
                            {AVAILABLE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-black/50" />
                        </div>
                      </div>

                      {/* Stock Input */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-black/70">Stock Quantity</label>
                        <Input
                          type="number"
                          min="0"
                          value={v.stock}
                          required
                          onChange={(e) => updateVariantRow(index, "stock", e.target.value)} />
                      </div>

                      {/* Remove Button */}
                      {!form.id && form.variants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariantRow(index)}
                          className="h-9 w-9 flex items-center justify-center rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 transition-colors mb-px"
                          title="Remove Variant"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add Row Button (Hidden during Edit Mode) */}
                  {!form.id && (
                    <Button
                      type="button"
                      onClick={addVariantRow}
                      className="mt-4 gap-2 bg-black/5 text-black hover:bg-black/10 border-none shadow-none w-full border border-black/20"
                    >
                      <Plus className="h-4 w-4" />
                      Add another variant
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-black/5">
                  <Button type="button" onClick={handleCancelEdit} className="bg-white text-black border border-black/10 hover:bg-black/5 shadow-none">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving || products.length === 0} className="gap-2 px-8">
                    <Edit3 className="h-4 w-4" />
                    {saving ? "Saving..." : form.id ? "Save Changes" : "Create Variants"}
                  </Button>
                </div>
              </fieldset>
            </form>
          </AdminPanel>
        )}

        {/* --- LIST TAB --- */}
        {activeTab === "list" && (
          <AdminPanel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-black">Stock Directory</h3>
                <p className="mt-1 text-sm text-black/60">Overview of all product configurations.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:inline-flex h-7 items-center rounded-full bg-black/5 px-3 text-xs font-medium text-black/70">
                  {variants.length} total variants
                </div>
                <button
                  type="button"
                  onClick={() => void reload()}
                  className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs text-black transition-colors hover:bg-black/5"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin opacity-50" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {loading ? (
                <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-black/50">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                  Syncing inventory...
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-black/50">
                  Create a product in the catalog first, then assign variants here.
                </div>
              ) : (
                products.map((product) => {
                  const productVariants = groupedVariants[product.id] || [];
                  const totalStock = productVariants.reduce((sum, v) => sum + (v.stock || 0), 0);

                  return (
                    <div key={product.id} className="overflow-hidden rounded-2xl border border-black/10 shadow-sm transition-all hover:border-black/20">
                      <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-black/3 px-4 py-3">
                        <div>
                          <div className="font-semibold text-black">{product.name}</div>
                          <div className="text-xs text-black/60 mt-0.5">{productVariants.length} variants established</div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium bg-white border border-black/10 px-2.5 py-1 rounded-lg">
                          <Package className="h-3.5 w-3.5 text-black/50" />
                          <span>{totalStock} Total</span>
                        </div>
                      </div>
                      <div className="divide-y divide-black/5 bg-white">
                        {productVariants.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-black/40">No variants active. Product is currently unavailable.</div>
                        ) : (
                          productVariants
                            .sort((a, b) => String(a.gsm).localeCompare(String(b.gsm)) || a.size.localeCompare(b.size))
                            .map((variant) => (
                              <div key={variant.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm group hover:bg-black/2">
                                <div className="flex items-center gap-4">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-black/5 font-bold text-black">
                                    {variant.size}
                                  </div>
                                  <div>
                                    <div className="font-medium text-black">
                                      {/* Renders Category if available, else defaults to GSM */}
                                      {[(variant as any).category, variant.gsm ? `${variant.gsm} GSM` : "Standard GSM"].filter(Boolean).join(" • ")}
                                    </div>
                                    <div className={`mt-0.5 text-xs font-medium ${(variant.stock || 0) > 10 ? 'text-emerald-600' :
                                      (variant.stock || 0) > 0 ? 'text-amber-600' : 'text-red-600'
                                      }`}>
                                      {variant.stock || 0} in stock
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                                  <button
                                    type="button"
                                    onClick={() => beginEdit(variant)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-black/50 transition-colors hover:bg-black/5 hover:text-black focus:bg-black/5 focus:text-black"
                                    title="Edit Variant"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void handleDelete(variant.id)}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-black/50 transition-colors hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600"
                                    title="Delete Variant"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </AdminPanel>
        )}
      </div>
    </AdminShell>
  );
}