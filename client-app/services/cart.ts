"use server";

import { getSupabaseClient } from "@/lib/supabase";

export async function fetchUserCart(userId: string) {
    const supabase = getSupabaseClient();

    try {
        // 1. Try to find the existing cart for this user
        let { data: cartData, error: cartError } = await supabase
            .from("cart")
            .select("id")
            .eq("user_id", userId)
            .maybeSingle(); // maybeSingle returns null instead of throwing an error if 0 rows are found

        if (cartError) throw cartError;

        let cartId = (cartData as { id: string } | null)?.id;

        // 2. If no cart exists, create one
        if (!cartId) {
            const { data: newCart, error: insertError } = await supabase
                .from("cart")
                .insert([{ user_id: userId }])
                .select("id")
                .single();

            if (insertError) throw insertError;
            cartId = newCart.id;
        }

        // 3. Fetch all items in the cart (Join with products table)
        // Supabase automatically detects foreign keys and nests the joined data
        const { data: itemsData, error: itemsError } = await supabase
            .from("cart_items")
            .select(`
        product_id,
        quantity,
        products (
          name,
          price,
          image
        )
      `)
            .eq("cart_id", cartId);

        if (itemsError) throw itemsError;

        // 4. Flatten the Supabase nested response to match your Context's CartItem[] type
        const formattedItems = itemsData.map((item: any) => ({
            id: item.product_id,
            quantity: item.quantity,
            name: item.products.name,
            price: item.products.price,
            image: item.products.image,
        }));

        return {
            id: cartId,
            items: formattedItems,
        };
    } catch (error) {
        console.error("Error fetching user cart:", error);
        throw new Error("Failed to fetch cart");
    }
}

/**
 * Adds an item to the cart. If it already exists, updates the quantity.
 */
export async function addCartItemToDB(payload: { cart_id: string; product_id: string; quantity: number }) {
    const supabase = getSupabaseClient();
    const { cart_id, product_id, quantity } = payload;

    try {
        // 1. Check if the item is already in the cart
        const { data: existingItem } = await supabase
            .from("cart_items")
            .select("id, quantity")
            .eq("cart_id", cart_id)
            .eq("product_id", product_id)
            .maybeSingle();

        if (existingItem) {
            // 2a. If it exists, update the quantity
            const { error } = await supabase
                .from("cart_items")
                .update({ quantity: existingItem.quantity + quantity })
                .eq("cart_id", cart_id)
                .eq("product_id", product_id);

            if (error) throw error;
        } else {
            // 2b. If it doesn't exist, insert a new row
            const { error } = await supabase
                .from("cart_items")
                .insert({ cart_id, product_id, quantity });

            if (error) throw error;
        }

        return { success: true };
    } catch (error) {
        console.error("Error adding item to DB:", error);
        throw new Error("Failed to add item to cart");
    }
}

/**
 * Removes a specific product entirely from a specific cart.
 */
export async function removeCartItemFromDB(cart_id: string, product_id: string) {
    const supabase = getSupabaseClient();

    try {
        const { error } = await supabase
            .from("cart_items")
            .delete()
            .eq("cart_id", cart_id)
            .eq("product_id", product_id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Error removing item from DB:", error);
        throw new Error("Failed to remove item from cart");
    }
}

/**
 * Updates the exact quantity of a product in the cart.
 */
export async function updateCartItemInDB(cart_id: string, product_id: string, quantity: number) {
    const supabase = getSupabaseClient();

    try {
        // Safety check: if quantity is somehow less than 1, delete the row instead
        if (quantity < 1) {
            return await removeCartItemFromDB(cart_id, product_id);
        }

        const { error } = await supabase
            .from("cart_items")
            .update({ quantity })
            .eq("cart_id", cart_id)
            .eq("product_id", product_id);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error("Error updating item quantity in DB:", error);
        throw new Error("Failed to update item quantity");
    }
}