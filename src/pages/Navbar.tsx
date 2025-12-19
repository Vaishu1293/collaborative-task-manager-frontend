import Link from "next/link";
import { useRouter } from "next/router";

type User = {
  id: string;
  name: string;
  email: string;
};

export default function Navbar({ user }: { user: User | null }) {
  const router = useRouter();

  async function logout() {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
      { credentials: "include" }
    );
    router.replace("/login");
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">
      {/* Left */}
      <div className="flex items-center gap-6">
        <span className="text-lg font-semibold text-white">
          Task Manager
        </span>

        {user && (
          <>
            <Link
              href="/tasks"
              className={`text-lg ${
                router.pathname === "/tasks"
                  ? "text-blue-400"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              Tasks
            </Link>

            <Link
              href="/dashboard"
              className={`text-lg ${
                router.pathname === "/dashboard"
                  ? "text-blue-400"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
          </>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-zinc-400">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-base text-zinc-200 hover:bg-zinc-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-lg text-zinc-300 hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-500"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
