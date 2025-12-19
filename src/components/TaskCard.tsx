type UserRef = {
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
  creator: UserRef;
  assignedTo?: UserRef | null;
};

const priorityStyles: Record<Task["priority"], string> = {
  LOW: "bg-zinc-700/40 text-zinc-300",
  MEDIUM: "bg-blue-500/15 text-blue-400",
  HIGH: "bg-orange-500/15 text-orange-400",
  URGENT: "bg-red-500/15 text-red-400",
};

const statusBorder: Record<Task["status"], string> = {
  TODO: "border-zinc-700",
  IN_PROGRESS: "border-blue-500/50",
  REVIEW: "border-yellow-500/50",
  COMPLETED: "border-green-500/50",
};

export function TaskCard({
  task,
  currentUserId,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  task: Task;
  currentUserId?: string;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: Task["status"]) => void;
}) {
  const isCreator = task.creator.id === currentUserId;

  return (
    <div
      className={`rounded-xl border ${statusBorder[task.status]} bg-zinc-900 p-5 shadow transition hover:shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white leading-snug">
            {task.title}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Created by {task.creator.name}
          </p>
        </div>

        {/* Status: editable only for creator */}
        {isCreator ? (
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(e.target.value as Task["status"])
            }
            className="rounded-lg bg-zinc-800 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>
        ) : (
          <span className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
            {task.status.replace("_", " ")}
          </span>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="mt-3 line-clamp-2 text-sm text-zinc-400">
          {task.description}
        </p>
      )}

      {/* Meta */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-1 font-medium ${priorityStyles[task.priority]}`}
          >
            {task.priority}
          </span>
          <span>
            Due {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>

        <span className="rounded bg-zinc-800 px-2 py-1">
          👤 {task.assignedTo?.name ?? "Unassigned"}
        </span>
      </div>

      {/* Actions — ONLY for creator */}
      {isCreator && (
        <div className="mt-5 flex justify-end gap-4 border-t border-zinc-800 pt-4">
          <button
            onClick={onEdit}
            className="text-sm font-medium text-blue-400 hover:underline"
          >
            Edit
          </button>

          <button
            onClick={() => {
              if (
                confirm(
                  "Are you sure you want to delete this task?"
                )
              ) {
                onDelete();
              }
            }}
            className="text-sm font-medium text-red-400 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
