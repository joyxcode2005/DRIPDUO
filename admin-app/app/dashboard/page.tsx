"use client";

import Link from "next/link";
import { ArrowRight, Boxes, Package, ReceiptText, Tags } from "lucide-react";
import { useEffect, useState } from "react";

import AdminShell, { AdminMetricCard, AdminPanel } from "@/components/admin/AdminShell";
import { formatCurrency, formatDateTime } from "@/utils/admin";
import { getCategories, getOrders, getProducts, getVariants } from "@/services/admin";

const overviewCards = [
    { href: "/dashboard/products", label: "Products", icon: Package },
    { href: "/dashboard/inventory", label: "Inventory", icon: Boxes },
    { href: "/dashboard/categories", label: "Categories", icon: Tags },
    { href: "/dashboard/orders", label: "Orders", icon: ReceiptText },
];

export default function DashboardPage() {
    const [productCount, setProductCount] = useState(0);
    const [categoryCount, setCategoryCount] = useState(0);
    const [variantCount, setVariantCount] = useState(0);
    const [latestOrder, setLatestOrder] = useState("—");
    const [latestRevenue, setLatestRevenue] = useState("—");

    useEffect(() => {
        let active = true;

        Promise.all([getProducts(), getCategories(), getVariants(), getOrders()])
            .then(([products, categories, variants, orders]) => {
                if (!active) {
                    return;
                }

                setProductCount(products.length);
                setCategoryCount(categories.length);
                setVariantCount(variants.length);
                setLatestOrder(formatDateTime(orders[0]?.createdAt));
                setLatestRevenue(orders[0]?.finalAmount ? formatCurrency(orders[0].finalAmount) : "—");
            })
            .catch(() => undefined);

        return () => {
            active = false;
        };
    }, []);

    return (
        <AdminShell
            title="Overview"
            description="Monitor catalog health, jump into inventory, and keep product operations moving from one place."
            actions={
                <Link
                    href="/dashboard/products"
                    className="inline-flex items-center gap-2 rounded-xl border border-black bg-black px-4 py-3 text-sm text-white transition-colors hover:bg-black/90"
                >
                    Open products
                    <ArrowRight className="h-4 w-4" />
                </Link>
            }
        >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <AdminMetricCard label="Products" value={productCount} helper="Active catalog entries" />
                <AdminMetricCard label="Categories" value={categoryCount} helper="Collection structure" />
                <AdminMetricCard label="Variants" value={variantCount} helper="Inventory rows" />
                <AdminMetricCard label="Latest order" value={latestOrder} helper={latestRevenue} />
            </div>

            <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                <AdminPanel>
                    <h3 className="text-lg font-semibold text-black">Quick access</h3>
                    <p className="mt-1 text-sm text-black/60">Jump into the next task without digging through menus.</p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {overviewCards.map(({ href, label, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-4 transition-colors hover:bg-black/5"
                            >
                                <span className="flex items-center gap-3 text-sm font-medium text-black">
                                    <Icon className="h-4 w-4 text-black/70" />
                                    {label}
                                </span>
                                <ArrowRight className="h-4 w-4 text-black/40" />
                            </Link>
                        ))}
                    </div>
                </AdminPanel>

                <AdminPanel>
                    <h3 className="text-lg font-semibold text-black">Workflow notes</h3>
                    <div className="mt-4 space-y-3 text-sm leading-6 text-black/60">
                        <p>Products sync pricing, category links, and media.</p>
                        <p>Inventory stays separate so stock changes stay focused on variants.</p>
                        <p>Orders remain read-only for now, giving you a clean operations view.</p>
                    </div>
                </AdminPanel>
            </div>
        </AdminShell>
    );
}