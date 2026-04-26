"use client";

import { DASHBOARD_NAV } from "@/constants";
import { createClient } from "@/utils/supabse";
import { Boxes, LayoutDashboard, LogOut, Package, ReceiptText, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { toast } from "react-toastify";

const navIcons: Record<string, ReactNode> = {
  "/dashboard": <LayoutDashboard className="h-4 w-4" />,
  "/dashboard/products": <Package className="h-4 w-4" />,
  "/dashboard/inventory": <Boxes className="h-4 w-4" />,
  "/dashboard/categories": <Tags className="h-4 w-4" />,
  "/dashboard/orders": <ReceiptText className="h-4 w-4" />,
};

type AdminShellProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AdminPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-black/10 bg-white p-5 ${className}`}>{children}</section>;
}

export function AdminMetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <p className="text-[11px] uppercase tracking-[0.28em] text-black/50">{label}</p>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-black">{value}</div>
      {helper ? <p className="mt-2 text-sm text-black/60">{helper}</p> : null}
    </div>
  );
}

export function AdminBadge({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-black/10 bg-white px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-black/60">{children}</span>;
}

export default function AdminShell({ title, description, actions, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col lg:flex-row">
        <aside className="border-b border-black/10 bg-white px-5 py-6 lg:min-h-screen lg:w-80 lg:border-b-0 lg:border-r lg:px-6">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.36em] text-black/50">DRIPDUO Admin</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-black">Catalog control center</h1>
            <p className="mt-2 text-sm leading-6 text-black/60">Manage products, inventory, categories, and placed orders from one workspace.</p>

            <nav className="mt-8 grid gap-2">
              {DASHBOARD_NAV.map((item) => {
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${active ? "border-black bg-black text-white" : "border-black/10 bg-white text-black hover:bg-black/5"}`}
                  >
                    <span className="flex items-center gap-3">
                      <span>{navIcons[item.href]}</span>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black bg-black px-4 py-3 text-sm text-white transition-colors hover:bg-black/90"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <AdminBadge>Workspace</AdminBadge>
                <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">{title}</h2>
                {description ? <p className="max-w-3xl text-sm leading-6 text-black/60 sm:text-base">{description}</p> : null}
              </div>
              {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
            </div>

            <div className="pt-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}