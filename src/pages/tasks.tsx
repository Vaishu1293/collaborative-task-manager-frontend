import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchTasks } from "@/lib/api";
import { useTaskSocket } from "@/hooks/useTaskSocket";
import { Skeleton } from "@/components/Skeleton";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { useAuth } from "@/hooks/useAuth";

/* =========================
   TYPES
========================= */
type User = {
  id: string;
  name: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  dueDate: string;
  creator: User;
  assignedTo?: User | null;
};

type Tab = "ALL" | "ASSIGNED_TO_ME" | "UNASSIGNED";

export default function TasksPage() {
  /* =========================
     AUTH
  ========================= */
  const { data: auth } = useAuth();
  const currentUserId = auth?.user?.id;

  /* =========================
     SOCKETS
  ========================= */
  useTaskSocket();

  const queryClient = useQueryClient();

  /* =========================
     FILTER STATE
  ========================= */
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [tab, setTab] = useState<Tab>("ALL");

  /* =========================
     MODAL STATE
  ========================= */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  /* =========================
     FETCH TASKS
  ========================= */
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", status, priority, sort],
    queryFn: () =>
      fetchTasks({
        status: status || undefined,
        priority: priority || undefined,
        sortByDueDate: sort,
      }),
  });

  /* =========================
     FETCH USERS (FOR ASSIGNMENT)
  ========================= */
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Failed users");
      return res.json();
    },
  });

  /* =========================
     TAB FILTERING
  ========================= */
  const filteredTasks = tasks.filter((task: any) => {
    if (tab === "ASSIGNED_TO_ME") {
      return task.assignedTo?.id === currentUserId;
    }
    if (tab === "UNASSIGNED") {
      return !task.assignedTo;
    }
    return true;
  });

  /* =========================
     CREATE TASK
  ========================= */
  const createTask = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Create failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  /* =========================
     UPDATE TASK
  ========================= */
  const updateTask = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  /* =========================
     DELETE TASK
  ========================= */
  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  /* =========================
     LOADING / ERROR
  ========================= */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 p-6 space-y-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl bg-zinc-900 p-5"
          >
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="mt-3 h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Failed to load tasks
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between">
        <h1 className="text-3xl font-semibold text-white">
          Tasks
        </h1>

        <button
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          + Create Task
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-3">
        {[
          ["ALL", "All"],
          ["ASSIGNED_TO_ME", "Assigned to Me"],
          ["UNASSIGNED", "Unassigned"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key as Tab)}
            className={`rounded-lg px-4 py-2 text-sm ${
              tab === key
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredTasks.map((task: any) => (
          <TaskCard
            key={task.id}
            task={task}
            currentUserId={currentUserId}
            onEdit={() => {
              setEditingTask(task);
              setModalOpen(true);
            }}
            onDelete={() => deleteTask.mutate(task.id)}
            onStatusChange={(status) =>
              updateTask.mutate({ id: task.id, status })
            }
          />
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          initialValues={editingTask ?? undefined}
          users={users}
          isCreator={
            !editingTask ||
            editingTask.creator.id === currentUserId
          }
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={(data) => {
            const payload = {
              ...data,
              dueDate: new Date(data.dueDate).toISOString(),
              assignedToId: data.assignedToId || undefined,
              status: editingTask ? data.status : "TODO",
            };

            editingTask
              ? updateTask.mutate({
                  id: editingTask.id,
                  ...payload,
                })
              : createTask.mutate(payload);

            setModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
