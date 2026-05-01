
import { Product } from "@/app/products/page";
import { createClient } from "@supabase/supabase-js"


// Init supabse client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export const getAllProducts = async (): Promise<Product[]> => {
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
            )
        `);


    console.log("Raw products data from Supabase:", JSON.stringify(data, null, 2));

    // 🛑 ALWAYS check the error object if data is null!
    if (error) {
        console.error("Supabase Error fetching products:", error);
        return [];
    }

    const formattedProducts: Product[] = data.map((product: any) => {

        // --- BULLETPROOF CATEGORY MAPPING ---
        const rawCategories = product.product_categories || [];
        const mappedCategories = rawCategories.map((pc: any) => {
            // If Supabase returned { categories: { id: "...", name: "..." } }
            if (pc.categories) return pc.categories;
            // If Supabase somehow returned it flat already { id: "...", name: "..." }
            return pc;
        }).filter(Boolean);

        // --- IMAGE MAPPING ---
        const mappedImages = product.product_images || [];
        const primaryImgObj = mappedImages.find((img: any) => img.is_primary) || mappedImages[0];
        const primaryUrl = primaryImgObj ? primaryImgObj.url : "/images/placeholder.jpg";

        return {
            ...product,
            categories: mappedCategories,
            images: mappedImages,
            primary_image_url: primaryUrl
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
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error(`Supabase Error fetching product with id ${id}:`, error);
        return null;
    }

    return {
        ...data,
        categories: data.product_categories?.map((pc: any) => pc.categories) || [],
        images: data.product_images || [],
        primary_image_url: (data.product_images || []).find((img: any) => img.is_primary)?.url || "/images/placeholder.jpg"
    };
};

// To fetch all the categories
export async function getAllCategories() {
    const { data, error } = await supabase.from("categories").select("id, name, slug, is_active");
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

