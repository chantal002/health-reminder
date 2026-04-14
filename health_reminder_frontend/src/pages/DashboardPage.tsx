import { useEffect, useState } from "react";
import {
  getReminders,
  getInventory,
  type Reminder,
  type InventoryItem,
} from "@/lib/api";
import { format } from "date-fns";
import { Bell, CheckCircle, Package, AlertTriangle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { Link } from "react-router-dom";

const LOW_STOCK = 5;

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getReminders(), getInventory()])
      .then(([r, i]) => {
        setReminders(r);
        setInventory(i);
      })
      .finally(() => setLoading(false));
  }, []);

  const upcoming = reminders.filter(
    (r) => !r.completed && new Date(r.dateTime) >= new Date(),
  );
  const completed = reminders.filter((r) => r.completed);
  const lowStock = inventory.filter((i) => i.quantity < LOW_STOCK);

  if (loading)
    return <div className="text-center py-12 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your health overview at a glance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Bell size={20} className="text-indigo-600" />}
          label="Upcoming"
          value={upcoming.length}
          color="bg-indigo-50"
        />
        <StatCard
          icon={<CheckCircle size={20} className="text-green-600" />}
          label="Completed"
          value={completed.length}
          color="bg-green-50"
        />
        <StatCard
          icon={<Package size={20} className="text-blue-600" />}
          label="Inventory Items"
          value={inventory.length}
          color="bg-blue-50"
        />
        <StatCard
          icon={<AlertTriangle size={20} className="text-yellow-600" />}
          label="Low Stock"
          value={lowStock.length}
          color="bg-yellow-50"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming reminders */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Upcoming Reminders</h2>
            <Link
              to="/reminders"
              className="text-sm text-indigo-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {upcoming.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-400 text-center">
                No upcoming reminders
              </p>
            ) : (
              upcoming.slice(0, 5).map((r) => (
                <div
                  key={r._id}
                  className="px-5 py-3 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(r.dateTime), "MMM d · h:mm a")}
                    </p>
                  </div>
                  {r.repeat !== "none" && (
                    <Badge variant="info" className="capitalize shrink-0">
                      {r.repeat}
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low stock items */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Low Stock Alerts</h2>
            <Link
              to="/inventory"
              className="text-sm text-indigo-600 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {lowStock.length === 0 ? (
              <p className="px-5 py-6 text-sm text-gray-400 text-center">
                All items are well stocked
              </p>
            ) : (
              lowStock.slice(0, 5).map((item) => (
                <div
                  key={item._id}
                  className="px-5 py-3 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.itemName}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {item.category}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-red-600 shrink-0">
                    Qty: {item.quantity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
