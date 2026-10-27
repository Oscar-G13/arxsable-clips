"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { signIn } from "@/lib/auth-client";
import { postAuthPath } from "@/lib/auth-redirect";
import { track } from "@/lib/datafast";

const filmFrames = [
  { src: "/clips/source.jpg", label: "SOURCE", frame: "01" },
  { src: "/clips/podcast-1.jpg", label: "CUT", frame: "02" },
  { src: "/clips/podcast-2.jpg", label: "EXPORT", frame: "03" },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await signIn.username({ username, password });

      if (response.error) {
        setMessage(response.error.message || "Unable to sign in");
        setLoading(false);
        return;
      }

      track("signin_completed", { auth_method: "username" });
      router.replace(postAuthPath(window.location.search));
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to sign in");
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#e9e7e1] text-[#161719] selection:bg-[#e85d32]/25">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,0.95),transparent_35%),radial-gradient(circle_at_56%_62%,rgba(148,163,184,0.22),transparent_32%),linear-gradient(135deg,#f4f2ec_0%,#dedbd3_50%,#f4f1ea_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(22,23,25,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(22,23,25,0.13)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(to_right,black,transparent_67%)]"
      />

      <div className="relative mx-auto grid min-h-dvh max-w-[1800px] lg:grid-cols-[minmax(0,1.18fr)_minmax(440px,0.82fr)]">
        <section className="relative flex min-h-[46vh] flex-col overflow-hidden border-b border-[#17181a]/15 px-5 pb-5 pt-5 sm:px-8 sm:pb-8 sm:pt-7 lg:min-h-dvh lg:border-b-0 lg:border-r lg:px-12 lg:pb-10 lg:pt-9 xl:px-16">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
            className="relative z-20 flex items-center justify-between font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[#161719]/55"
          >
            <span>Private edit suite</span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#e85d32] shadow-[0_0_0_4px_rgba(232,93,50,0.13)]" />
              Frame / 001
            </span>
          </motion.div>

          <div className="relative flex flex-1 items-center justify-center py-8 sm:py-12 lg:py-6">
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 size-[min(72vw,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#17181a]/10" />
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 size-[min(60vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#17181a]/15"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={{ duration: 80, ease: "linear", repeat: Infinity }}
            />
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 size-[min(46vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e85d32]/25"
              animate={reduceMotion ? undefined : { scale: [0.98, 1.025, 0.98], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
            />
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-[82%] -translate-x-1/2 bg-[#17181a]/10" />
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[76%] w-px -translate-y-1/2 bg-[#17181a]/10" />

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.12, ease }}
              className="relative z-10 w-[min(55vw,500px)] min-w-[205px] max-w-[500px] sm:min-w-[250px] lg:w-[min(35vw,500px)]"
            >
              <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-white/85 blur-3xl" />
              <Image
                src="/arx-clips-logo.png"
                alt="ARX Clips"
                width={1254}
                height={1254}
                priority
                className="relative h-auto w-full drop-shadow-[0_32px_38px_rgba(17,18,20,0.22)]"
              />
            </motion.div>

            <div aria-hidden="true" className="absolute left-0 top-1/2 hidden -translate-y-1/2 items-center gap-3 lg:flex">
              <span className="h-px w-10 bg-[#17181a]/25" />
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#17181a]/45 [writing-mode:vertical-rl]">Precision / motion</span>
            </div>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32, ease }}
            className="relative z-20 hidden lg:block"
          >
            <div className="mb-3 flex items-end justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-[#17181a]/48">
              <span>Sequence / 00:00:30</span>
              <span>Source → select → publish</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {filmFrames.map((item) => (
                <div key={item.frame} className="group relative h-[88px] overflow-hidden border border-[#17181a]/15 bg-[#d4d1ca] p-1.5 shadow-[0_8px_20px_rgba(18,19,21,0.08)] xl:h-[106px]">
                  <div className="relative h-full overflow-hidden bg-[#cbc8c1]">
                    <Image src={item.src} alt="" fill sizes="(min-width: 1024px) 18vw, 0px" className="object-cover saturate-[0.55] transition duration-700 group-hover:scale-[1.04] group-hover:saturate-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-2 font-mono text-[9px] tracking-[0.18em] text-white/90">{item.frame} / {item.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative mt-3 h-px bg-[#17181a]/25">
              <span className="absolute -top-1 left-0 size-2 rounded-full border border-[#17181a]/35 bg-[#e9e7e1]" />
              <span className="absolute -top-1 right-0 size-2 rounded-full border border-[#17181a]/35 bg-[#e9e7e1]" />
              <motion.span
                aria-hidden="true"
                className="absolute -top-[7px] h-[15px] w-px bg-[#e85d32] shadow-[0_0_12px_rgba(232,93,50,0.85)]"
                initial={{ left: "6%" }}
                animate={reduceMotion ? undefined : { left: ["6%", "94%", "6%"] }}
                transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        <section className="relative flex min-h-[54vh] flex-col bg-[#f8f6f1]/92 px-5 py-8 backdrop-blur-xl sm:px-10 lg:min-h-dvh lg:px-14 lg:py-10 xl:px-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-[#17181a]/45"
          >
            <span>Secure entry / 01</span>
            <span className="flex items-center gap-2"><LockKeyhole className="size-3" aria-hidden="true" />Session protected</span>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="mx-auto flex w-full max-w-[430px] flex-1 flex-col justify-center py-12 lg:py-16"
          >
            <div className="mb-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-[#e85d32]" />
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b74322]">Private studio access</p>
              </div>
              <h1 className="font-display text-[clamp(2.7rem,5vw,4.5rem)] font-semibold leading-[0.91] tracking-[-0.055em] text-[#151618]">Welcome{" "}<br />back.</h1>
              <p className="mt-5 max-w-sm text-[15px] leading-6 text-[#505157]">Enter your workspace credentials to continue to the cutting room.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#303136]">Username</label>
                <div className="group relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 size-[17px] -translate-y-1/2 text-[#77787d] transition-colors group-focus-within:text-[#e85d32]" aria-hidden="true" />
                  <input
                    id="username"
                    className="h-14 w-full rounded-none border border-[#1a1b1d]/20 bg-white/70 pl-12 pr-4 text-[15px] font-medium text-[#151618] shadow-[0_8px_24px_rgba(20,21,23,0.035)] outline-none transition duration-300 placeholder:text-[#8d8e92] hover:border-[#1a1b1d]/35 focus:border-[#e85d32] focus:bg-white focus:ring-4 focus:ring-[#e85d32]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    type="text"
                    placeholder="Your username"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2.5 flex items-center justify-between">
                  <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#303136]">Password</label>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#17181a]/40">Encrypted</span>
                </div>
                <div className="group relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-[17px] -translate-y-1/2 text-[#77787d] transition-colors group-focus-within:text-[#e85d32]" aria-hidden="true" />
                  <input
                    id="password"
                    className="h-14 w-full rounded-none border border-[#1a1b1d]/20 bg-white/70 pl-12 pr-14 text-[15px] font-medium text-[#151618] shadow-[0_8px_24px_rgba(20,21,23,0.035)] outline-none transition duration-300 placeholder:text-[#8d8e92] hover:border-[#1a1b1d]/35 focus:border-[#e85d32] focus:bg-white focus:ring-4 focus:ring-[#e85d32]/10 disabled:cursor-not-allowed disabled:opacity-60"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-1.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center text-[#65666b] transition-colors hover:text-[#e85d32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e85d32]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="size-[18px]" aria-hidden="true" /> : <Eye className="size-[18px]" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              {message ? (
                <div className="flex items-start gap-2.5 border-l-2 border-[#c83c2a] bg-[#c83c2a]/[0.06] px-3.5 py-3 text-sm text-[#9e2f22]" role="alert" aria-live="polite">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#c83c2a]" aria-hidden="true" />
                  <span>{message}</span>
                </div>
              ) : null}

              <button
                type="submit"
                className="group relative flex h-14 w-full items-center justify-between overflow-hidden bg-[#17181a] px-5 text-sm font-semibold text-white shadow-[0_16px_32px_rgba(17,18,20,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#242528] hover:shadow-[0_20px_38px_rgba(17,18,20,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e85d32] focus-visible:ring-offset-4 focus-visible:ring-offset-[#f8f6f1] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
                disabled={loading}
                aria-label={loading ? "Opening studio" : "Open studio"}
              >
                <span aria-hidden="true" className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-[430%]" />
                <span>{loading ? "Opening studio…" : "Open studio"}</span>
                <span className="flex size-8 items-center justify-center bg-[#e85d32] text-white transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </button>
            </form>

            <div className="mt-7 flex items-center justify-between border-t border-[#17181a]/10 pt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#17181a]/42">
              <span>Private workspace</span>
              <span>Press enter to continue</span>
            </div>
          </motion.div>

          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#17181a]/35">Designed for focused work / No public access</p>
        </section>
      </div>
    </main>
  );
}
