import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
      <div className="w-full max-w-3xl text-center">
        {/* Title */}
        <h1 className="mb-6 text-4xl font-bold text-white">
          Collaborative Task Manager
        </h1>

        {/* Subtitle */}
        <p className="mb-10 text-lg leading-8 text-zinc-400">
          A real-time, collaborative task management platform built with
          <span className="text-white font-medium"> Next.js</span>,{" "}
          <span className="text-white font-medium">Node.js</span>,{" "}
          <span className="text-white font-medium">PostgreSQL</span>, and{" "}
          <span className="text-white font-medium">Socket.io</span>.
        </p>

        {/* Feature List */}
        <div className="mb-12 grid gap-6 text-left md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-semibold text-white">
              🚀 Real-Time Collaboration
            </h3>
            <p className="text-zinc-400">
              Instantly see task updates, status changes, and assignments
              across all users using WebSockets.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-semibold text-white">
              🔐 Secure Authentication
            </h3>
            <p className="text-zinc-400">
              JWT-based authentication with HttpOnly cookies and protected
              routes for complete security.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-semibold text-white">
              📊 Smart Dashboards
            </h3>
            <p className="text-zinc-400">
              View tasks assigned to you, created by you, and overdue tasks
              in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h3 className="mb-2 text-xl font-semibold text-white">
              ⚙️ Modern Tech Stack
            </h3>
            <p className="text-zinc-400">
              Built using React Query, Prisma ORM, Tailwind CSS, and a clean
              service-based backend architecture.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="w-full rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-blue-500 sm:w-auto"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-8 py-3 text-lg font-semibold text-zinc-200 transition hover:bg-zinc-800 sm:w-auto"
          >
            Create Account
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-12 text-sm text-zinc-500">
          Built as a full-stack engineering assessment demonstrating real-world
          architecture, real-time systems, and scalable frontend design.
        </p>
      </div>
    </div>
  );
}
