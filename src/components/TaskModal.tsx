import { useForm } from "react-hook-form";
import { useEffect } from "react";

type User = {
  id: string;
  name: string;
};

type TaskForm = {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  dueDate: string;
  assignedToId?: string;
};

export function TaskModal({
  initialValues,
  users = [],
  isCreator,
  onSubmit,
  onClose,
}: {
  initialValues?: Partial<TaskForm>;
  users?: User[];
  isCreator: boolean;
  onSubmit: (data: TaskForm) => void;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskForm>({
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      dueDate: "",
      ...initialValues,
    },
  });

  // 🔁 Reset form when editing a different task
  useEffect(() => {
    reset({
      title: "",
      description: "",
      priority: "MEDIUM",
      status: "TODO",
      dueDate: "",
      ...initialValues,
    });
  }, [initialValues, reset]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg rounded-2xl bg-zinc-900 p-6 shadow-xl"
      >
        {/* Header */}
        <h2 className="mb-6 text-2xl font-semibold text-white">
          {initialValues
            ? isCreator
              ? "Edit Task"
              : "View Task"
            : "Create Task"}
        </h2>

        {/* Title */}
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          Title
        </label>
        <input
          {...register("title", {
            required: "Title is required",
          })}
          disabled={!isCreator}
          className="mb-2 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white disabled:opacity-60"
        />
        {errors.title && (
          <p className="mb-3 text-xs text-red-400">
            {errors.title.message}
          </p>
        )}

        {/* Description */}
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          Description
        </label>
        <textarea
          {...register("description")}
          disabled={!isCreator}
          rows={3}
          className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white disabled:opacity-60"
        />

        {/* Priority + Status */}
        <div className="mb-4 flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              Priority
            </label>
            <select
              {...register("priority")}
              disabled={!isCreator}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white disabled:opacity-60"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              Status
            </label>
            <select
              {...register("status")}
              disabled={!isCreator}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white disabled:opacity-60"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">
                In Progress
              </option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">
                Completed
              </option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          Due Date
        </label>
        <input
          type="date"
          {...register("dueDate", {
            required: "Due date is required",
          })}
          disabled={!isCreator}
          className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white disabled:opacity-60"
        />
        {errors.dueDate && (
          <p className="mb-3 text-xs text-red-400">
            {errors.dueDate.message}
          </p>
        )}

        {/* Assign To — 🔒 Creator only */}
        {isCreator && (
          <>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              Assign To
            </label>
            <select
              {...register("assignedToId")}
              className="mb-6 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-white"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-zinc-400 hover:bg-zinc-800"
          >
            Close
          </button>

          {isCreator && (
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-500"
            >
              Save Task
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
