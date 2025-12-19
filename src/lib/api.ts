const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export type TaskScope = "all" | "assigned" | "unassigned" | "created";

export async function fetchTasks(params?: {
  status?: string;
  priority?: string;
  sortByDueDate?: "asc" | "desc";
  scope?: TaskScope;
}) {
  const query = new URLSearchParams();

  if (params?.status) query.set("status", params.status);
  if (params?.priority) query.set("priority", params.priority);
  if (params?.sortByDueDate) query.set("sortByDueDate", params.sortByDueDate);
  if (params?.scope && params.scope !== "all") query.set("scope", params.scope);

  const url = query.toString()
    ? `${API_URL}/api/tasks?${query.toString()}`
    : `${API_URL}/api/tasks`;

  const res = await fetch(url, { credentials: "include" });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || "Failed to fetch tasks");
  return data;
}

export async function fetchDashboard() {
  const res = await fetch(`${API_URL}/api/tasks/dashboard`, {
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch dashboard");
  return data;
}

export async function fetchUsers() {
  const res = await fetch(`${API_URL}/api/users`, {
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to fetch users");
  return data;
}

export async function createTask(payload: any) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to create task");
  return data;
}

export async function updateTask(id: string, payload: any) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update task");
  return data;
}

export async function deleteTask(id: string) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Failed to delete task");
  }

  return true;
}

