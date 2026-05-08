// app/profile/page.tsx
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";


export default async function ProfilePage() {
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

  if (!user) {
    // Instantly redirect if not authenticated
    redirect("/auth");
  }

  // Pass the verified user down to your interactive client component
  return <ProfileClient initialUser={user} />;
}


