import type { Reminder } from "@/lib/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { format } from "date-fns";
import { Bell, CheckCircle, Pencil, Repeat, Trash2 } from "lucide-react";

interface Props {
  reminder: Reminder;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (id: string) => void;
}

const repeatColors: Record<string, "default" | "info" | "warning" | "success"> =
  {
    none: "default",
    daily: "info",
    weekly: "warning",
    monthly: "success",
  };

export default function ReminderCard({
  reminder,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const isPast =
    new Date(reminder.dateTime) < new Date() && !reminder.completed;

  return (
    <div
      className={`bg-white rounded-xl border p-4 flex flex-col gap-3 shadow-sm transition-opacity ${reminder.completed ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Bell
            size={16}
            className={isPast ? "text-red-500" : "text-indigo-500"}
          />
          <h3
            className={`font-medium text-gray-900 truncate ${reminder.completed ? "line-through text-gray-400" : ""}`}
          >
            {reminder.title}
          </h3>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(reminder)}
            aria-label="Edit"
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(reminder._id)}
            aria-label="Delete"
          >
            <Trash2 size={14} className="text-red-500" />
          </Button>
        </div>
      </div>

      {reminder.description && (
        <p className="text-sm text-gray-500">{reminder.description}</p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className={isPast ? "text-red-500 font-medium" : ""}>
            {format(new Date(reminder.dateTime), "MMM d, yyyy · h:mm a")}
          </span>
          {reminder.repeat !== "none" && (
            <span className="flex items-center gap-1">
              <Repeat size={12} />
              <Badge variant={repeatColors[reminder.repeat]}>
                {reminder.repeat}
              </Badge>
            </span>
          )}
        </div>
        <button
          onClick={() => onToggle(reminder._id, !reminder.completed)}
          className={`flex items-center gap-1 text-xs font-medium rounded-full px-3 py-1 transition-colors ${
            reminder.completed
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <CheckCircle size={12} />
          {reminder.completed ? "Completed" : "Mark done"}
        </button>
      </div>
    </div>
  );
}
