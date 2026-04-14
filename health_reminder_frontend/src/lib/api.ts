const BASE = `${import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000"}/api`;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

// Reminders
export const getReminders = () => request<Reminder[]>("/reminders");
export const createReminder = (data: ReminderInput) =>
  request<Reminder>("/reminders", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateReminder = (
  id: string,
  data: Partial<ReminderInput & { completed: boolean }>,
) =>
  request<Reminder>(`/reminders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteReminder = (id: string) =>
  request(`/reminders/${id}`, { method: "DELETE" });

// Inventory
export const getInventory = () => request<InventoryItem[]>("/inventory");
export const createInventoryItem = (data: InventoryInput) =>
  request<InventoryItem>("/inventory", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateInventoryItem = (
  id: string,
  data: Partial<InventoryInput>,
) =>
  request<InventoryItem>(`/inventory/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteInventoryItem = (id: string) =>
  request(`/inventory/${id}`, { method: "DELETE" });

// Types
export interface Reminder {
  _id: string;
  title: string;
  description?: string;
  dateTime: string;
  repeat: "none" | "daily" | "weekly" | "monthly";
  completed: boolean;
  createdAt: string;
}

export interface ReminderInput {
  title: string;
  description?: string;
  dateTime: string;
  repeat: "none" | "daily" | "weekly" | "monthly";
}

export interface InventoryItem {
  _id: string;
  itemName: string;
  quantity: number;
  category: string;
  expiryDate?: string;
  createdAt: string;
}

export interface InventoryInput {
  itemName: string;
  quantity: number;
  category: string;
  expiryDate?: string;
}
