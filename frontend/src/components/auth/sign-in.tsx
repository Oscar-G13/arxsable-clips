"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signIn } from "@/lib/auth-client";
import { postAuthPath } from "@/lib/auth-redirect";
import { track } from "@/lib/datafast";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await signIn.email({ email, password });

      if (response.error) {
        setMessage(response.error.message || "Unable to sign in");
        setLoading(false);
        return;
      }

      track("signin_completed", { auth_method: "email" });
      router.replace(postAuthPath(window.location.search));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in");
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0B0B0D] px-5 py-8 text-[#F5F5F7]">
      <div
        aria-hidden="true"
        className="arx-auth-glow pointer-events-none absolute -inset-[20%] bg-[radial-gradient(circle_at_center,#15151A_0%,#0B0B0D_68%)]"
      />
      <section className="relative w-full max-w-[400px] rounded-2xl border border-[#1F1F23] bg-[#0B0B0D]/95 p-10 shadow-2xl shadow-black/30">
        <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#8A8A93]">
          ARX SABLE
        </p>
        <h1 className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.02em] text-[#F5F5F7]">
          Clips
        </h1>

        <form onSubmit={handleSubmit} className="mt-9 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-xs font-medium text-[#F5F5F7]">
              Email
            </label>
            <input
              id="email"
              className="h-11 w-full rounded-lg border border-[#2A2A30] bg-[#111114] px-3.5 text-sm text-[#F5F5F7] outline-none transition-colors placeholder:text-[#5F5F68] focus:border-[#F5F5F7] disabled:cursor-not-allowed disabled:opacity-60"
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-xs font-medium text-[#F5F5F7]">
              Password
            </label>
            <input
              id="password"
              className="h-11 w-full rounded-lg border border-[#2A2A30] bg-[#111114] px-3.5 text-sm text-[#F5F5F7] outline-none transition-colors placeholder:text-[#5F5F68] focus:border-[#F5F5F7] disabled:cursor-not-allowed disabled:opacity-60"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="flex h-11 w-full items-center justify-center rounded-lg bg-[#F5F5F7] text-sm font-semibold text-[#0B0B0D] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0D] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
            aria-label={loading ? "Signing in" : "Enter"}
          >
            {loading ? (
              <span className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-1.5 animate-pulse rounded-full bg-[#0B0B0D]" />
                <span className="size-1.5 animate-pulse rounded-full bg-[#0B0B0D] [animation-delay:160ms]" />
                <span className="size-1.5 animate-pulse rounded-full bg-[#0B0B0D] [animation-delay:320ms]" />
              </span>
            ) : (
              "Enter"
            )}
          </button>

          {message ? (
            <p className="text-sm text-[#E5484D]" role="alert" aria-live="polite">
              {message}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
}
