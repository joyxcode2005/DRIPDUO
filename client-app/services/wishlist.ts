// lib/wishlistService.ts (or wherever you keep your Supabase queries)

import { getSupabaseClient } from "@/lib/supabase";



export const fetchWishlist = async (userId: string) => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
        .from('wishlists')
        .select(`
      id,
      product_id,
      products (
        id,
        name,
        price,
        discount,
        final_price,
        product_images (url)
      )
    `)
        .eq('user_id', userId);

    if (error) {
        console.error('Error fetching wishlist:', error);
        return [];
    }
    return data;
};

export const addToWishlist = async (productId: string, userId: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
        .from('wishlists')
        .insert([{ user_id: userId, product_id: productId }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const removeFromWishlist = async (productId: string, userId: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

    if (error) throw error;
    return true;
};