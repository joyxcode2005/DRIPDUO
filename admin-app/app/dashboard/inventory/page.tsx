"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Edit3, Plus, RefreshCw, Trash2, ChevronDown, Package, List, Tag } from "lucide-react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import AdminShell, { AdminPanel } from "@/components/admin/AdminShell";
import { deleteVariant, getProducts, getVariants, upsertVariant } from "@/services/admin";
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
      setForm((current) => ({ ...current, product_id: current.product_id || productData[0]?.id || "" }));
    } catch (error) { toast.error("Failed to load inventory"); } 
    finally { setLoading(false); }
  };

  useEffect(() => { void reload(); }, []);

  const addVariantRow = () => setForm((curr) => ({ ...curr, variants: [...curr.variants, { gsm: "", size: "", stock: "0" }] }));
  const removeVariantRow = (index: number) => setForm((curr) => ({ ...curr, variants: curr.variants.filter((_, i) => i !== index) }));
  const updateVariantRow = (index: number, field: string, value: string) => {
    setForm((curr) => {
      const newVariants = [...curr.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...curr, variants: newVariants };
    });
  };

  const beginEdit = (variant: ProductVariantRow) => {
    setForm({ id: variant.id, product_id: variant.product_id, variants: [{ gsm: variant.gsm ? String(variant.gsm) : "", size: variant.size, stock: String(variant.stock) }] });
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => setForm((current) => ({ ...emptyForm, product_id: current.product_id || products[0]?.id || "" }));
  const handleCancelEdit = () => { resetForm(); setActiveTab("list"); };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    for (const v of form.variants) {
      if (!v.size || !v.gsm) return toast.error("Please complete GSM and Size for all variants.");
    }
    setSaving(true);
    try {
      if (form.id) {
        const v = form.variants[0];
        await upsertVariant({ id: form.id, product_id: form.product_id, size: v.size, stock: Number(v.stock || 0), gsm: v.gsm } as any);
        toast.success("Variant updated");
      } else {
        const promises = form.variants.map((v) => {
          const existing = variants.find((ext) => ext.product_id === form.product_id && ext.size === v.size && String(ext.gsm) === v.gsm);
          const finalStock = existing ? (existing.stock || 0) + Number(v.stock || 0) : Number(v.stock || 0);
          return upsertVariant({ id: existing?.id, product_id: form.product_id, size: v.size, stock: finalStock, gsm: v.gsm } as any); 
        });
        await Promise.all(promises);
        toast.success(`Processed ${promises.length} variants!`);
      }
      resetForm(); setActiveTab("list"); await reload();
    } catch (error) { toast.error("Failed to save variants"); } 
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this inventory variant?")) return;
    try {
      await deleteVariant(id); toast.success("Deleted");
      if (form.id === id) { resetForm(); setActiveTab("list"); }
      await reload();
    } catch (error) { toast.error("Failed to delete"); }
  };

  const groupedVariants = useMemo(() => {
    return variants.reduce<Record<string, ProductVariantRow[]>>((acc, variant) => {
      if (!acc[variant.product_id]) acc[variant.product_id] = [];
      acc[variant.product_id].push(variant);
      return acc;
    }, {});
  }, [variants]);

  return (
    <AdminShell
      title="Inventory"
      description="Manage sizes, GSM types, categories, and stock amounts."
      actions={
        <Button onClick={() => { resetForm(); setActiveTab("form"); }} className="flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-3 sm:py-2">
          <Plus className="h-4 w-4" /> New variant
        </Button>
      }
    >
      <div className="mb-6 flex w-full sm:w-auto sm:inline-flex rounded-xl bg-black/5 p-1">
        <button onClick={() => setActiveTab("list")} className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "list" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"}`}>
          <List className="h-4 w-4" /> Directory
        </button>
        <button onClick={() => { if (!form.id) resetForm(); setActiveTab("form"); }} className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "form" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"}`}>
          <Tag className="h-4 w-4" /> {form.id ? "Edit" : "Manage"}
        </button>
      </div>

      <div className="grid gap-6">
        {activeTab === "form" && (
          <AdminPanel>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-black">{form.id ? "Edit Variant" : "Add Variants"}</h3>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <fieldset disabled={saving} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black">Target Product</label>
                  <div className="relative">
                    <select value={form.product_id} required onChange={(e) => setForm((c) => ({ ...c, product_id: e.target.value }))} className="w-full appearance-none rounded-lg border border-black/10 bg-white px-3 py-3 sm:py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black/10">
                      {products.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                  </div>
                </div>

                <div className="space-y-4 border-t border-black/5 pt-4">
                  <div className="flex w-full items-center justify-between">
                    <label className="text-sm font-medium text-black">Configurations</label>
                    {!form.id && (<Button type="button" onClick={addVariantRow} className="p-2 bg-black text-white rounded-full"><Plus className="h-4 w-4" /></Button>)}
                  </div>

                  {form.variants.map((v, index) => (
                    <div key={index} className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_1fr_auto] gap-4 p-4 rounded-xl border border-black/10 bg-black/2 relative">
                      <div className="w-full">
                        <label className="text-xs font-medium text-black/70 block mb-1">GSM</label>
                        <select value={v.gsm} required onChange={(e) => updateVariantRow(index, "gsm", e.target.value)} className="w-full rounded-lg border border-black/10 px-3 py-3 sm:py-2 text-sm bg-white">
                          <option value="" disabled>Select...</option>
                          {AVAILABLE_GSMS.map(g => <option key={g} value={g}>{g} GSM</option>)}
                        </select>
                      </div>
                      <div className="w-full">
                        <label className="text-xs font-medium text-black/70 block mb-1">Size</label>
                        <select value={v.size} required onChange={(e) => updateVariantRow(index, "size", e.target.value)} className="w-full rounded-lg border border-black/10 px-3 py-3 sm:py-2 text-sm bg-white">
                          <option value="" disabled>Select...</option>
                          {AVAILABLE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="w-full">
                        <label className="text-xs font-medium text-black/70 block mb-1">Stock Qty</label>
                        <Input type="number" min="0" value={v.stock} required onChange={(e) => updateVariantRow(index, "stock", e.target.value)} className="w-full py-3 sm:py-2" />
                      </div>
                      {!form.id && form.variants.length > 1 && (
                        <button type="button" onClick={() => removeVariantRow(index)} className="mt-2 sm:mt-0 sm:mb-1 w-full sm:w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 text-red-500 border border-red-200">
                          <Trash2 className="h-4 w-4" /> <span className="sm:hidden ml-2 font-medium">Remove</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col-reverse sm:flex-row flex-wrap justify-end gap-3 pt-4 border-t border-black/5">
                  <Button type="button" onClick={handleCancelEdit} className="w-full sm:w-auto py-3 sm:py-2 bg-red-400 text-white rounded-lg shadow-none">Cancel</Button>
                  <Button type="submit" disabled={saving || products.length === 0} className="w-full sm:w-auto py-3 sm:py-2 px-8">{saving ? "Saving..." : form.id ? "Save Changes" : "Create"}</Button>
                </div>
              </fieldset>
            </form>
          </AdminPanel>
        )}

        {activeTab === "list" && (
          <AdminPanel>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div><h3 className="text-lg font-semibold text-black">Stock Directory</h3></div>
              <button type="button" onClick={() => void reload()} className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-medium text-black hover:bg-black/5">
                <RefreshCw className="h-3.5 w-3.5" /> Refresh
              </button>
            </div>

            <div className="space-y-4">
              {products.map((product) => {
                const productVariants = groupedVariants[product.id] || [];
                const totalStock = productVariants.reduce((sum, v) => sum + (v.stock || 0), 0);

                return (
                  <div key={product.id} className="overflow-hidden rounded-2xl border border-black/10 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 bg-black/5 px-4 py-3">
                      <div>
                        <div className="font-bold text-black">{product.name}</div>
                        <div className="text-xs text-black/60">{productVariants.length} variants</div>
                      </div>
                      <div className="inline-flex items-center gap-2 text-xs font-bold bg-white border border-black/10 px-2.5 py-1 rounded-lg w-fit">
                        <Package className="h-3.5 w-3.5 text-black/60" /> {totalStock} Total
                      </div>
                    </div>
                    
                    <div className="divide-y divide-black/5 bg-white">
                      {productVariants.map((variant) => (
                        <div key={variant.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 group hover:bg-black/2">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 bg-black/5 font-bold text-black">{variant.size}</div>
                            <div>
                              <div className="font-medium text-black text-sm">{variant.gsm ? `${variant.gsm} GSM` : "Standard"}</div>
                              <div className={`text-xs font-bold ${variant.stock > 10 ? 'text-emerald-600' : variant.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>{variant.stock || 0} in stock</div>
                            </div>
                          </div>
                          
                          {/* Visible Actions on Mobile, Hover on Desktop */}
                          <div className="flex gap-2 w-full sm:w-auto pt-2 mt-2 border-t sm:border-t-0 sm:pt-0 sm:mt-0 border-black/5 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => beginEdit(variant)} className="flex-1 sm:flex-none flex justify-center items-center h-9 sm:h-8 px-4 sm:px-2 rounded-lg border border-black/10 hover:bg-black/5 bg-white sm:bg-transparent"><Edit3 className="h-4 w-4" /></button>
                            <button onClick={() => void handleDelete(variant.id)} className="flex-1 sm:flex-none flex justify-center items-center h-9 sm:h-8 px-4 sm:px-2 rounded-lg border border-red-100 text-red-600 bg-red-50 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </AdminPanel>
        )}
      </div>
    </AdminShell>
  );
}