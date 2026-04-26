"use client"

import { useState } from "react"

import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

export default function LoginClient() {
  const [showPassword, setShowPassword] = useState(false)

  return (  
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_35%),linear-gradient(180deg,#fafaf8_0%,#f3f4ef_100%)] text-foreground dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%),linear-gradient(180deg,#101010_0%,#0a0a0a_100%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          animate={{ y: [0, 12, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute -right-24 top-28 h-52 w-52 rounded-full bg-foreground/5 blur-3xl dark:bg-white/10"
          animate={{ y: [0, -10, 0], x: [0, -8, 0] }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-size-[44px_44px] opacity-40 dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="max-w-xl"
          >
            <motion.div variants={itemVariants} className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Quiet, focused access
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Welcome back to the admin panel.
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              A calm sign-in screen for the DRIPDUO team. Clean hierarchy, soft motion, and a fast path back into the dashboard.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Secure", text: "Protected admin access." },
                { icon: Sparkles, title: "Smooth", text: "Subtle motion only." },
                { icon: Lock, title: "Focused", text: "Minimal distractions." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-border/60 bg-background/75 p-4 shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
                  <Icon className="h-4 w-4 text-primary" />
                  <div className="mt-3 text-sm font-medium">{title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute inset-x-6 top-6 -z-10 h-full rounded-[2rem] bg-primary/10 blur-2xl" />
            <div className="rounded-[2rem] border border-border/70 bg-background/80 p-6 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8">
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground">Admin sign in</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">Enter your credentials</h2>
              </div>

              <form className="space-y-4">
                <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ duration: 0.25, delay: 0.05 }} className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@dripduo.com"
                      className="h-11 pl-9"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ duration: 0.25, delay: 0.1 }} className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="h-11 pl-9 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-1.5 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>

                <div className="flex items-center justify-between gap-3 pt-1 text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="h-4 w-4 rounded border-border text-primary focus:ring-ring/30" />
                    Remember me
                  </label>
                  <a href="#" className="text-foreground/80 transition-colors hover:text-foreground">
                    Forgot password?
                  </a>
                </div>

                <motion.div variants={itemVariants} initial="hidden" animate="show" transition={{ duration: 0.25, delay: 0.15 }} className="pt-2">
                  <Button type="submit" className="h-11 w-full rounded-xl text-sm shadow-sm transition-transform duration-300 hover:-translate-y-0.5">
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </form>

              <p className="mt-5 text-center text-sm text-muted-foreground">
                Protected workspace for the DRIPDUO team.
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  )
}