"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getClientAuth } from "@/lib/firebase/client";
import { Button } from "@/components/ui/button";

const inputClasses =
  "w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500/70";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const credential = await signInWithEmailAndPassword(getClientAuth(), email, password);
      const idToken = await credential.user.getIdToken();

      // Trailing slash matches next.config `trailingSlash: true` so the POST
      // isn't 308-redirected (which can drop the body).
      const response = await fetch("/api/auth/session/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("session-failed");
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Ongeldig e-mailadres of wachtwoord.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8">
        <div className="flex justify-center mb-8">
          <Image src="/logo.svg" alt="VisualVibe" width={250} height={48} className="h-8 w-auto" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-white/70">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm text-white/70">
              Wachtwoord
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClasses}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-0 h-11 mt-2"
          >
            {isSubmitting ? "Bezig met inloggen..." : "Inloggen"}
          </Button>
        </form>
      </div>
    </div>
  );
}
