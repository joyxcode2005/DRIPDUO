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

  // Notice we do NOT redirect here if !user, because guests can browse products.
  // We just pass the userId down (it will be undefined if they are a guest).
  return <ProductsClient userId={user?.id} />;
}