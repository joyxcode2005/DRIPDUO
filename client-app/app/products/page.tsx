// app/products/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ProductsClient from "./ProductClient";

export default async function ProductsPage() {
    const cookieStore = await cookies();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
            },
        }
    );

    // Check auth status securely on the server
    const { data: { user } } = await supabase.auth.getUser();

    // Extract the user ID (fallback to an empty string if it's a guest viewing the store)
    const userId = user?.id || "";

    // Pass the verified userId down to your interactive client component
    return <ProductsClient userId={userId} />;
}


