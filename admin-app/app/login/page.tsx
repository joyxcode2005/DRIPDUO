"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { createClient } from "@/utils/supabse";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error(`Login failed: ${error.message}`);
      setLoading(false);
      return;
    }

    toast.success("Login successful");
    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-white px-4 py-12 text-black">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center">
        <section className="w-full rounded-2xl border border-black/10 bg-white p-8">
          <div className="mb-8 space-y-2">
            <p className="text-sm uppercase tracking-[0.28em] text-black/50">DRIPDUO Admin</p>
            <h1 className="text-3xl font-semibold tracking-tight text-black">Sign in</h1>
            <p className="text-sm leading-6 text-black/60">Use your admin email and password to access the dashboard.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-black">Email</label>
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
              <label htmlFor="password" className="text-sm font-medium text-black">Password</label>
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
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}