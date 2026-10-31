"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ZLogo } from "@/components/ui/ZLogo";
import { setAuth } from "@/lib/admin-auth";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setAuth(data.token, data.admin);
      router.push("/admin");
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-echo-base flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-echo-primary/5 via-transparent to-transparent" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <ZLogo size={40} />
          </div>
          <h1 className="font-display text-2xl font-bold text-echo-text">
            Admin Console
          </h1>
          <p className="text-echo-text-secondary text-sm mt-1">
            Sign in to manage Echo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="echo-card p-6 space-y-4">
          {error && (
            <div className="bg-echo-danger/10 text-echo-danger text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-echo-text-secondary mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@echo.zolentix.com"
              className="echo-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-echo-text-secondary mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="echo-input pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-echo-text-muted hover:text-echo-text"
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full echo-btn-primary py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-echo-text-muted text-xs mt-6">
          Demo credentials: admin@echo.zolentix.com / echo2024
        </p>
      </div>
    </div>
  );
}
