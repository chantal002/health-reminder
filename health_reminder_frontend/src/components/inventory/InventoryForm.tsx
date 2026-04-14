import { useState } from "react";
import type { InventoryInput } from "@/lib/api";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface Props {
  initial?: Partial<InventoryInput>;
  onSubmit: (data: InventoryInput) => Promise<void>;
  onCancel: () => void;
}

const categoryOptions = [
  { value: "medicines", label: "Medicines" },
  { value: "supplements", label: "Supplements" },
  { value: "groceries", label: "Groceries" },
  { value: "equipment", label: "Equipment" },
  { value: "other", label: "Other" },
];

export default function InventoryForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<InventoryInput>({
    itemName: initial?.itemName ?? "",
    quantity: initial?.quantity ?? 1,
    category: initial?.category ?? "medicines",
    expiryDate: initial?.expiryDate ? initial.expiryDate.slice(0, 10) : "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof InventoryInput>(
    field: K,
    value: InventoryInput[K],
  ) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemName.trim()) return setError("Item name is required");
    if (form.quantity < 0) return setError("Quantity must be 0 or more");
    setError("");
    setLoading(true);
    try {
      await onSubmit({ ...form, expiryDate: form.expiryDate || undefined });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="itemName"
        label="Item Name"
        placeholder="e.g. Vitamin C"
        value={form.itemName}
        onChange={(e) => set("itemName", e.target.value)}
      />
      <Input
        id="quantity"
        label="Quantity"
        type="number"
        min={0}
        value={form.quantity}
        onChange={(e) => set("quantity", Number(e.target.value))}
      />
      <Select
        id="category"
        label="Category"
        options={categoryOptions}
        value={form.category}
        onChange={(e) => set("category", e.target.value)}
      />
      <Input
        id="expiryDate"
        label="Expiry Date (optional)"
        type="date"
        value={form.expiryDate ?? ""}
        onChange={(e) => set("expiryDate", e.target.value)}
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
