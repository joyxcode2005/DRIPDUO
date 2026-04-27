"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Edit3, Plus, RefreshCw, Trash2, ChevronDown, Package, Check, List, Tag } from "lucide-react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import AdminShell, { AdminPanel } from "@/components/admin/AdminShell";
import { deleteVariant, getProducts, getVariants, upsertVariant } from "@/services/admin";
import { ProductRow, ProductVariantRow } from "@/types";

const emptyForm = {
  id: "",
  product_id: "",
  size: "",
  stock: "0",
  gsms: [] as string[],
};

const AVAILABLE_GSMS = ["180", "210", "230", "240"];

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

  const beginEdit = (variant: ProductVariantRow) => {
    setForm({
      id: variant.id,
      product_id: variant.product_id,
      size: variant.size,
      stock: String(variant.stock),
      gsms: variant.gsm ? [String(variant.gsm)] : [],
    });
    setActiveTab("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setForm((current) => ({
      ...emptyForm,
      product_id: current.product_id || products[0]?.id || "",
      gsms: current.gsms, 
    }));
  };

  const handleCancelEdit = () => {
    resetForm();
    setActiveTab("list");
  };

  const toggleGsm = (gsm: string) => {
    if (form.id) {
      setForm((curr) => ({ ...curr, gsms: [gsm] }));
    } else {
      setForm((curr) => ({
        ...curr,
        gsms: curr.gsms.includes(gsm) ? curr.gsms.filter((g) => g !== gsm) : [...curr.gsms, gsm],
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // FIX 1: Use a Set to strip out duplicate sizes if the user accidentally types "M, M"
    const rawSizes = form.size.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
    const sizesArray = [...new Set(rawSizes)];
    
    if (sizesArray.length === 0) return toast.error("Please enter at least one size.");
    if (form.gsms.length === 0) return toast.error("Please select at least one GSM.");
    
    setSaving(true);

    try {
      if (form.id) {
        // EDIT MODE: Update single variant
        await upsertVariant({
          id: form.id,
          product_id: form.product_id,
          size: sizesArray[0], 
          stock: Number(form.stock || 0),
          gsm: form.gsms[0], 
        });
        toast.success("Variant updated successfully");
      } else {
        // BULK CREATE MODE: Safely generate or update the matrix
        const promises = [];
        
        for (const size of sizesArray) {
          for (const gsm of form.gsms) {
            
            // FIX 2: Check if this exact variant already exists in the local state
            const existingVariant = variants.find(
              (v) => v.product_id === form.product_id && v.size === size && String(v.gsm) === gsm
            );

            // FIX 3: If it exists, add the new stock to the old stock. Otherwise, use the new stock.
            const newStockAmount = Number(form.stock || 0);
            const finalStock = existingVariant 
              ? (existingVariant.stock || 0) + newStockAmount 
              : newStockAmount;

            promises.push(
              upsertVariant({
                id: existingVariant?.id, // Passing the ID forces an UPDATE instead of an INSERT
                product_id: form.product_id,
                size: size,
                stock: finalStock,
                gsm: gsm,
              })
            );
          }
        }
        
        await Promise.all(promises);
        toast.success(`Processed ${promises.length} variant configuration${promises.length > 1 ? 's' : ''}!`);
      }
      
      resetForm();
      setActiveTab("list"); // Return to list after successful save
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
      description="Manage sizes, GSM types, and stock amounts. Bulk create multiple sizes and GSMs at once."
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
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "list" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"
          }`}
        >
          <List className="h-4 w-4" />
          Stock Directory
        </button>
        <button
          onClick={() => {
            if (!form.id) resetForm(); // Only reset if we aren't currently editing
            setActiveTab("form");
          }}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            activeTab === "form" ? "bg-white text-black shadow-sm" : "text-black/60 hover:text-black"
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
                  {form.id ? "Edit Variant" : "Bulk Create Variants"}
                </h3>
                <p className="mt-1 text-sm text-black/60">
                  {form.id ? "Update the size, stock, or GSM." : "Select multiple GSMs and type sizes separated by commas to create a matrix."}
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

                {/* Multi-Select GSM Pills */}
                <div className="space-y-2 sm:col-span-2 border-t border-black/5 pt-4">
                  <label className="text-sm font-medium text-black flex items-center justify-between">
                    <span>Fabric GSM</span>
                    {!form.id && <span className="text-xs font-normal text-black/40">Select multiple options</span>}
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AVAILABLE_GSMS.map((gsm) => {
                      const isSelected = form.gsms.includes(gsm);
                      return (
                        <button
                          key={gsm}
                          type="button"
                          onClick={() => toggleGsm(gsm)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium border transition-colors outline-none focus:ring-2 focus:ring-black/10 ${
                            isSelected 
                              ? "bg-black text-white border-black" 
                              : "bg-white text-black/70 border-black/10 hover:border-black/30 hover:bg-black/5"
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          {gsm} GSM
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 border-t border-black/5 pt-4">
                  <div className="space-y-2">
                    <label htmlFor="size" className="text-sm font-medium text-black flex items-center justify-between">
                      <span>{form.id ? "Size" : "Size(s)"}</span>
                    </label>
                    <Input
                      id="size"
                      name="size"
                      type="text"
                      value={form.size}
                      placeholder={form.id ? "e.g. L" : "S, M, L, XL"}
                      required
                      onChange={(event) => setForm((current) => ({ ...current, size: event.target.value.toUpperCase() }))}
                    />
                    {!form.id && (
                      <p className="text-[11px] text-black/40 mt-1">Comma separate for bulk creation</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="stock" className="text-sm font-medium text-black">
                      {form.id ? "Quantity in Stock" : "Stock to Add"}
                    </label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      required
                      onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                    />
                    {!form.id && (
                      <p className="text-[11px] text-black/40 mt-1">Applied to each selected combination</p>
                    )}
                  </div>
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
                      <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-black/[0.03] px-4 py-3">
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
                              <div key={variant.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm group hover:bg-black/[0.02]">
                                <div className="flex items-center gap-4">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-black/5 font-bold text-black">
                                    {variant.size}
                                  </div>
                                  <div>
                                    <div className="font-medium text-black">
                                      {variant.gsm ? `${variant.gsm} GSM` : "Standard GSM"}
                                    </div>
                                    <div className={`mt-0.5 text-xs font-medium ${
                                      (variant.stock || 0) > 10 ? 'text-emerald-600' : 
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