
import { createClient } from "@supabase/supabase-js"


// Init supabse client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export const getProductsForLookbookSection = async () => {
    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            product_images (
                url,
                is_primary
            )
        `)

    if (error) {
        console.error("Supabase Error fetching lookbook products:", error);
        return [];
    }

    return data;
}

export const getProductsforFeaturedSection = async () => {
    const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            product_images (
                url,
                is_primary
            )
        `)
        .limit(5);

    if (error) {
        console.error("Supabase Error fetching featured products:", error);
        return [];
    }

    return data;
}

export const getAllProducts = async () => {
    const { data, error } = await supabase
        .from("products")
        .select(`
            *,
            product_categories (
                categories (
                    id,
                    name,
                    slug,
                    is_active
                )
            ),
            product_images (
                id,
                url,
                is_primary
            ),
            product_variants (
                id,
                size,
                gsm,
                stock
            )
        `);

    console.log("Raw products data from Supabase:", JSON.stringify(data, null, 2));

    // 🛑 ALWAYS check the error object if data is null!
    if (error) {
        console.error("Supabase Error fetching products:", error);
        return [];
    }

    const formattedProducts = data.map((product: any) => {

        // --- BULLETPROOF CATEGORY MAPPING ---
        const rawCategories = product.product_categories || [];
        const mappedCategories = rawCategories.map((pc: any) => {
            if (pc.categories) return pc.categories;
            return pc;
        }).filter(Boolean);

        // --- IMAGE MAPPING ---
        const mappedImages = product.product_images || [];
        const primaryImgObj = mappedImages.find((img: any) => img.is_primary) || mappedImages[0];
        const primaryUrl = primaryImgObj ? primaryImgObj.url : "/images/placeholder.jpg";

        // --- VARIANT & STOCK MAPPING ---
        const variants = product.product_variants || [];

        // Calculate the combined stock across all sizes and GSMs
        const totalStock = variants.reduce((sum: number, variant: any) => sum + (variant.stock || 0), 0);

        return {
            ...product,
            categories: mappedCategories,
            images: mappedImages,
            primary_image_url: primaryUrl,
            variants: variants,           // Keep the raw array for size/gsm selection menus
            total_stock: totalStock,      // Useful for "Out of Stock" badges
            is_in_stock: totalStock > 0   // Quick boolean for conditional rendering
        };
    });

    return formattedProducts;
};

export const getProductById = async (id: string) => {
    const { data, error } = await supabase
        .from("products")
        .select(`
            *,
            product_categories (
                categories (
                    id,
                    name,
                    slug,
                    is_active,
                    parent_id
                )
            ),
            product_images (
                id,
                url,
                is_primary
            ),
            product_variants (
                id,
                size,
                gsm,
                stock
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error(`Supabase Error fetching product with id ${id}:`, error);
        return null;
    }

    // ✅ Filter the variants array so it ONLY includes items with stock greater than 0
    const availableVariants = (data.product_variants || []).filter(
        (variant: any) => variant.stock > 0
    );

    return {
        ...data,
        categories: data.product_categories?.map((pc: any) => pc.categories) || [],
        images: data.product_images || [],
        primary_image_url: (data.product_images || []).find((img: any) => img.is_primary)?.url || "/images/placeholder.jpg",

        // ✅ Return only the filtered, in-stock variants
        variants: availableVariants
    };
};

// To fetch all the categories
export async function getAllCategories() {
    const { data, error } = await supabase.from("categories").select("id, name, slug, is_active, parent_id");
    if (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
    return data;
}

// To fetch product types
export async function getAllProductTypes() {
    const { data, error } = await supabase.from("product_type").select("*");
    if (error) {
        console.error("Error fetching product types:", error);
        throw error;
    }
    return data;
}

