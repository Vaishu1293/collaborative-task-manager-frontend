import { useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ LOGIN
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // 2️⃣ FORCE AUTH STATE TO LOAD (CRITICAL)
      await queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn: async () => {
          const meRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
            { credentials: "include" }
          );

          if (!meRes.ok) {
            throw new Error("Auth verification failed");
          }

          return meRes.json();
        },
      });

      // 3️⃣ NAVIGATE ONLY AFTER AUTH IS CONFIRMED
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-xl"
      >
        {/* Heading */}
        <h1 className="mb-2 text-3xl font-semibold text-white">
          Welcome Back
        </h1>
        <p className="mb-6 text-base text-zinc-400">
          Login to manage your tasks
        </p>

        {error && (
          <p className="mb-4 rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Email */}
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          Email
        </label>
        <input
          className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-base text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          Password
        </label>
        <input
          className="mb-6 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-base text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="••••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Login Button */}
        <button
          className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/40 disabled:opacity-60"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-base text-zinc-400">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-blue-400 hover:underline"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
