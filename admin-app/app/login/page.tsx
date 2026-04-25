"use client";


import Button from "@/components/Button";
import Input from "@/components/Input";
import { createClient } from "@/utils/supabse";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useState } from "react"
import { toast } from "react-toastify";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);

    // Init supabase client
    const supabase = createClient();

    // Attempt to sign in 
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error("Login error: ", error.message);
      toast.error("Login failed: " + error.message);
    }


    toast.success("Login successful!");
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(245,245,244,1)_48%,rgba(228,228,231,1))] px-4 py-12 text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <section className="w-full rounded-3xl border border-white/60 bg-white/85 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="mb-8 space-y-2 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500">
              DRIPDUO Admin
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-sm leading-6 text-slate-600">
              Use your admin email and password to access the dashboard.
            </p>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                autoComplete="email"
                placeholder="admin@dripduo.com"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                autoComplete="current-password"
                placeholder="Enter your password"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
            {loading ? (
              <div className="flex items-center justify-center">
                <ClipLoader size={24} color="#000" />
              </div>
            ) : (
              <Button
                onClick={handleLogin}
              >
                Sign In
              </Button>
            )}
          </form>
        </section>
      </div>
    </main>
  )
}