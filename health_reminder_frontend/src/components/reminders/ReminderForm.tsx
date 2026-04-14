import { useState } from "react";
import type { ReminderInput } from "@/lib/api";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface Props {
  initial?: Partial<ReminderInput>;
  onSubmit: (data: ReminderInput) => Promise<void>;
  onCancel: () => void;
}

const repeatOptions = [
  { value: "none", label: "No repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export default function ReminderForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<ReminderInput>({
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    dateTime: initial?.dateTime ? initial.dateTime.slice(0, 16) : "",
    repeat: initial?.repeat ?? "none",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field: keyof ReminderInput, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    if (!form.dateTime) return setError("Date & time is required");
    setError("");
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="title"
        label="Title"
        placeholder="e.g. Take medication"
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
      />
      <Input
        id="description"
        label="Description (optional)"
        placeholder="Additional notes..."
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
      />
      <Input
        id="dateTime"
        label="Date & Time"
        type="datetime-local"
        value={form.dateTime}
        onChange={(e) => set("dateTime", e.target.value)}
      />
      <Select
        id="repeat"
        label="Repeat"
        options={repeatOptions}
        value={form.repeat}
        onChange={(e) =>
          set("repeat", e.target.value as ReminderInput["repeat"])
        }
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
