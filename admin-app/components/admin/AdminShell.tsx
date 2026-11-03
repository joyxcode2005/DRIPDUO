"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, ShoppingBag, Box, Tags, ReceiptText } from "lucide-react";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: ReceiptText },
    { name: "Products", href: "/dashboard/products", icon: ShoppingBag },
    { name: "Inventory", href: "/dashboard/inventory", icon: Box },
    { name: "Categories", href: "/dashboard/categories", icon: Tags },
];

export function AdminMetricCard({ label, value, helper }: { label: string; value: string | number; helper?: string }) {
    return (
        <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-black/60">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-black">{value}</p>
            {helper && <p className="mt-2 text-xs text-black/50">{helper}</p>}
        </div>
    );
}

export function AdminPanel({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-black/10 bg-white p-5 sm:p-6 shadow-sm">
            {children}
        </div>
    );
}

export default function AdminShell({
    children,
    title,
    description,
    actions
}: {
    children: React.ReactNode;
    title?: string;
    description?: string;
    actions?: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-[#F9F9F9] overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-black/10 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col ${
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between p-5 border-b border-black/10 h-16">
                    <span className="text-lg font-bold tracking-tight text-black">DripDuo Admin</span>
                    <button
                        className="md:hidden rounded-md p-2 text-black/50 hover:bg-black/5"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-black text-white"
                                        : "text-black/60 hover:bg-black/5 hover:text-black"
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b border-black/10 bg-white p-4 md:hidden">
                    <button
                        className="-ml-2 rounded-md p-2 text-black/60 hover:bg-black/5"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <span className="font-bold tracking-tight text-black">DripDuo</span>
                    <div className="w-10" /> {/* Spacer for centering */}
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                    <div className="mx-auto max-w-7xl space-y-6">
                        {/* Page Header integrated into Shell */}
                        {(title || description || actions) && (
                            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    {title && <h1 className="text-2xl font-bold text-black">{title}</h1>}
                                    {description && <p className="mt-1 text-sm text-black/60">{description}</p>}
                                </div>
                                {actions && <div className="mt-2 w-full sm:mt-0 sm:w-auto">{actions}</div>}
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}