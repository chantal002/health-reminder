import { useEffect, useState } from "react";
import {
  type InventoryInput,
  type InventoryItem,
  createInventoryItem,
  deleteInventoryItem,
  getInventory,
  updateInventoryItem,
} from "@/lib/api";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import InventoryForm from "@/components/inventory/InventoryForm";
import { format } from "date-fns";
import {
  AlertTriangle,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

const LOW_STOCK = 5;

const categoryColors: Record<
  string,
  "default" | "info" | "warning" | "success" | "danger"
> = {
  medicines: "danger",
  supplements: "success",
  groceries: "info",
  equipment: "warning",
  other: "default",
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<InventoryItem | null>(null);

  const load = async () => {
    try {
      const data = await getInventory();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (data: InventoryInput) => {
    const created = await createInventoryItem(data);
    setItems((prev) => [created, ...prev]);
    setModalOpen(false);
  };

  const handleUpdate = async (data: InventoryInput) => {
    if (!editing) return;
    const updated = await updateInventoryItem(editing._id, data);
    setItems((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await deleteInventoryItem(id);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const categories = [
    "all",
    ...Array.from(new Set(items.map((i) => i.category))),
  ];

  const filtered = items.filter((i) => {
    const matchSearch = i.itemName.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || i.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const lowStockCount = items.filter((i) => i.quantity < LOW_STOCK).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} items total
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Item
        </Button>
      </div>

      {lowStockCount > 0 && (
        <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
          <AlertTriangle size={16} className="shrink-0" />
          {lowStockCount} item{lowStockCount !== 1 ? "s" : ""} running low on
          stock (qty &lt; {LOW_STOCK})
        </div>
      )}

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-colors ${
                categoryFilter === cat
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <p>No items found.</p>
          {items.length === 0 && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setModalOpen(true)}
            >
              Add your first item
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.itemName}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={categoryColors[item.category] ?? "default"}
                      className="capitalize"
                    >
                      {item.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-medium ${item.quantity < LOW_STOCK ? "text-red-600" : "text-gray-700"}`}
                    >
                      {item.quantity}
                      {item.quantity < LOW_STOCK && (
                        <AlertTriangle
                          size={12}
                          className="inline ml-1 text-red-500"
                        />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {item.expiryDate
                      ? format(new Date(item.expiryDate), "MMM d, yyyy")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditing(item)}
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item._id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Inventory Item"
      >
        <InventoryForm
          onSubmit={handleCreate}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Inventory Item"
      >
        {editing && (
          <InventoryForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  );
}
