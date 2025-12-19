import { useState } from "react";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      }
    );

    if (!res.ok) {
      setError("Signup failed. Please try again.");
      return;
    }

    router.push("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md rounded-2xl bg-zinc-900 p-8 shadow-xl"
      >
        {/* Heading */}
        <h1 className="mb-2 text-3xl font-semibold text-white">
          Create Account
        </h1>
        <p className="mb-6 text-base text-zinc-400">
          Sign up to start managing your tasks
        </p>

        {error && (
          <p className="mb-4 rounded bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Name */}
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          Full Name
        </label>
        <input
          className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-base text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          placeholder="Create a strong password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Submit */}
        <button
          className="w-full rounded-lg bg-blue-600 py-3 text-lg font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
          type="submit"
        >
          Create Account
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-base text-zinc-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-blue-400 hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
