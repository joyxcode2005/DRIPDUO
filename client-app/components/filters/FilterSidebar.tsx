import React from "react";
import { X } from "lucide-react";

// Mirroring the type from your main page
type Product_Type = {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
};

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    productTypes: Product_Type[];
    activeType: string;
    setActiveType: (type: string) => void;
}

export default function FilterSidebar({
    isOpen,
    onClose,
    productTypes,
    activeType,
    setActiveType
}: FilterSidebarProps) {

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                onClick={onClose}
            />
            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-100 bg-[#0a0a0a] border-l border-zinc-800 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-between px-8 py-6 border-b border-zinc-800 shrink-0">
                    <span className="font-sans text-[11px] font-semibold tracking-[0.2em] uppercase text-zinc-100">
                        Filter & Sort
                    </span>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-10">
                    <div>
                        <h4 className="text-[11px] tracking-[0.15em] uppercase text-zinc-500 mb-6">
                            Product Type
                        </h4>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveType("All")}
                                className={`text-left py-2 text-[12px] tracking-[0.12em] uppercase transition-colors ${activeType === "All"
                                    ? "text-white font-semibold"
                                    : "text-zinc-400 hover:text-zinc-200"
                                    }`}
                            >
                                ALL TYPES
                            </button>

                            {productTypes?.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveType(t.is_active ? t.slug : "All")}
                                    className={`text-left py-2 text-[12px] tracking-[0.12em] uppercase transition-colors ${activeType === t.slug
                                        ? "text-white font-semibold"
                                        : "text-zinc-400 hover:text-zinc-200"
                                        }`}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Add more filter groups here later (e.g., Colors, Sizes, Price Range) */}

                </div>
                <div className="p-6 border-t border-zinc-800 flex gap-4 shrink-0 bg-[#0a0a0a]">
                    <button
                        onClick={() => setActiveType("All")}
                        className="flex-1 py-3.5 text-[11px] font-semibold tracking-widest uppercase text-zinc-400 hover:text-white transition-colors border border-zinc-800 rounded-md hover:border-zinc-600"
                    >
                        Clear
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 bg-white text-black text-[11px] font-semibold tracking-widest uppercase rounded-md hover:bg-zinc-200 transition-colors"
                    >
                        Apply
                    </button>
                </div>
            </aside>
        </>
    );
}