import { useEffect, useState } from "react";
import {
  type Reminder,
  type ReminderInput,
  createReminder,
  deleteReminder,
  getReminders,
  updateReminder,
} from "@/lib/api";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ReminderCard from "@/components/reminders/ReminderCard";
import ReminderForm from "@/components/reminders/ReminderForm";
import { Plus } from "lucide-react";

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Reminder | null>(null);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  const load = async () => {
    try {
      const data = await getReminders();
      setReminders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (data: ReminderInput) => {
    const created = await createReminder(data);
    setReminders((prev) => [...prev, created]);
    setModalOpen(false);
  };

  const handleUpdate = async (data: ReminderInput) => {
    if (!editing) return;
    const updated = await updateReminder(editing._id, data);
    setReminders((prev) =>
      prev.map((r) => (r._id === updated._id ? updated : r)),
    );
    setEditing(null);
  };

  const handleToggle = async (id: string, completed: boolean) => {
    const updated = await updateReminder(id, { completed });
    setReminders((prev) =>
      prev.map((r) => (r._id === updated._id ? updated : r)),
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this reminder?")) return;
    await deleteReminder(id);
    setReminders((prev) => prev.filter((r) => r._id !== id));
  };

  const filtered = reminders.filter((r) => {
    if (filter === "upcoming") return !r.completed;
    if (filter === "completed") return r.completed;
    return true;
  });

  const upcoming = reminders.filter((r) => !r.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Reminders</h1>
          <p className="text-sm text-gray-500 mt-1">
            {upcoming} upcoming reminder{upcoming !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> New Reminder
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {(["all", "upcoming", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
              filter === f
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No reminders found.</p>
          {filter === "all" && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setModalOpen(true)}
            >
              Create your first reminder
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ReminderCard
              key={r._id}
              reminder={r}
              onToggle={handleToggle}
              onEdit={(r) => setEditing(r)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Reminder"
      >
        <ReminderForm
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Reminder"
      >
        {editing && (
          <ReminderForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
