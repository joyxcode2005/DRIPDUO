import { getSupabaseClient } from "@/lib/supabase";


const supabase = getSupabaseClient();

type CartRow = {
    id: string;
};

type CartItemRow = {
    id: string;
    quantity: number;
    products?: {
        id: string;
        name: string;
        price: number | null;
        final_price: number | null;
        product_images?: Array<{
            url: string;
            is_primary: boolean;
        }>;
    } | null;
    product_variants?: {
        size: string | null;
        gsm: string | null;
    } | null;
};

export type CartRecord = {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    size?: string;
    gsm?: string;
};

// 1. Fetch Cart Items
export const fetchCartItems = async (userId: string): Promise<CartRecord[]> => {
    // First, get the user's cart
    const { data: cartData, error: cartError } = await supabase
        .from('cart')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

    const cart = cartData as CartRow | null;

    if (cartError && !cart) {
        console.error("Error fetching cart:", cartError);
        return [];
    }

    if (!cart) return [];

    // Then, fetch the items with joined product and variant data
    const { data: itemsData, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
      id,
      quantity,
      products ( id, name, price, final_price, product_images (url, is_primary) ),
      product_variants ( id, size, gsm )
    `)
        .eq('cart_id', cart.id);

    const items = (itemsData ?? []) as CartItemRow[];

    if (itemsError) {
        console.error("Error fetching cart items:", itemsError);
        return [];
    }

    // Format the data so your CartDrawer can easily read it
    return items.map((item) => {
        // Find the primary image, or default to the first one
        const images = item.products?.product_images || [];
        const primaryImage = images.find((Image) => Image.is_primary) || images[0];

        return {
            id: item.id,
            productId: item.products?.id || item.id,
            name: item.products?.name,
            price: Number(item.products?.final_price || item.products?.price || 0),
            image: primaryImage?.url || "/images/placeholder.jpg",
            size: item.product_variants?.size,
            gsm: item.product_variants?.gsm,
            quantity: Number(item.quantity),
        };
    }) as CartRecord[];
};

// 2. Update Quantity in DB
export const updateDbQuantity = async (cartItemId: string | number, newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent zero or negative quantities

    const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);

    if (error) console.error("Update error:", error);
};

// 3. Remove Item from DB
export const removeDbItem = async (cartItemId: string | number) => {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

    if (error) console.error("Delete error:", error);
};