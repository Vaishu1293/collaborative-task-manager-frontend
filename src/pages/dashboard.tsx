import { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { fetchDashboard } from "@/lib/api";
import { useTaskSocket } from "@/hooks/useTaskSocket";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/Skeleton";

/* =========================
   TYPES (MATCH BACKEND)
========================= */
type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  dueDate: string;
};

type DashboardResponse = {
  assigned: Task[];
  created: Task[];
  overdue: Task[];
};

/* =========================
   SECTION COMPONENT
========================= */
function Section({
  title,
  tasks,
}: {
  title: string;
  tasks: Task[];
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-lg">
      <h2 className="mb-4 text-xl font-semibold text-white">
        {title}
      </h2>

      {tasks.length === 0 ? (
        <p className="text-base text-zinc-400">
          No tasks
        </p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-medium text-white">
                    {task.title}
                  </p>

                  {task.description && (
                    <p className="mt-1 text-base text-zinc-400 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="text-right text-sm text-zinc-400">
                  <p className="font-semibold text-blue-400">
                    {task.priority}
                  </p>
                  <p>{task.status.replace("_", " ")}</p>
                  <p className="mt-1">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* =========================
   DASHBOARD PAGE
========================= */
export default function DashboardPage() {
  const router = useRouter();

  /* 🔐 AUTH */
  const { data: auth, isLoading: authLoading } = useAuth();

  /* 🔴 SOCKET: auto-refresh dashboard */
  useTaskSocket();

  /* 🔒 Redirect if not logged in */
  useEffect(() => {
    if (!authLoading && !auth?.user) {
      router.replace("/login");
    }
  }, [authLoading, auth, router]);

  /* 📊 FETCH DASHBOARD */
  const {
    data,
    isLoading,
    error,
  } = useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    enabled: !!auth?.user, // 🔥 don't fetch until logged in
    initialData: {
      assigned: [],
      created: [],
      overdue: [],
    },
  });

  /* ⏳ LOADING STATE */
  if (authLoading || isLoading) {
    return (
      <div className="grid gap-6 p-6 md:grid-cols-3 bg-zinc-950 min-h-screen">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <Skeleton className="h-6 w-1/2 bg-zinc-700" />
            <Skeleton className="mt-5 h-4 w-full bg-zinc-800" />
            <Skeleton className="mt-3 h-4 w-3/4 bg-zinc-800" />
          </div>
        ))}
      </div>
    );
  }

  /* ❌ ERROR STATE */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-red-400 text-lg">
        Failed to load dashboard
      </div>
    );
  }

  /* ✅ UI */
  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <h1 className="mb-8 text-3xl font-semibold text-white">
        Dashboard
      </h1>

      <div className="grid gap-8 md:grid-cols-3">
        <Section
          title="Assigned to Me"
          tasks={data.assigned}
        />
        <Section
          title="Created by Me"
          tasks={data.created}
        />
        <Section
          title="Overdue"
          tasks={data.overdue}
        />
      </div>
    </div>
  );
}
