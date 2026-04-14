import { Hono } from "hono";
import { cors } from "hono/cors";
import mongoose from "mongoose";

const app = new Hono();

// Middleware
app.use("/*", cors());

// MongoDB Connection
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/health_reminder";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Models
const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dateTime: { type: Date, required: true },
  repeat: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly"],
    default: "none",
  },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  expiryDate: Date,
  createdAt: { type: Date, default: Date.now },
});

const Reminder = mongoose.model("Reminder", reminderSchema);
const Inventory = mongoose.model("Inventory", inventorySchema);

// Health check
app.get("/", (c) => c.json({ message: "Health Reminder API" }));

// Reminder Routes
app.get("/api/reminders", async (c) => {
  try {
    const reminders = await Reminder.find().sort({ dateTime: 1 });
    return c.json(reminders);
  } catch (error) {
    return c.json({ error: "Failed to fetch reminders" }, 500);
  }
});

app.post("/api/reminders", async (c) => {
  try {
    const body = await c.req.json();
    const reminder = new Reminder(body);
    await reminder.save();
    return c.json(reminder, 201);
  } catch (error) {
    return c.json({ error: "Failed to create reminder" }, 400);
  }
});

app.put("/api/reminders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const reminder = await Reminder.findByIdAndUpdate(id, body, { new: true });
    if (!reminder) return c.json({ error: "Reminder not found" }, 404);
    return c.json(reminder);
  } catch (error) {
    return c.json({ error: "Failed to update reminder" }, 400);
  }
});

app.delete("/api/reminders/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const reminder = await Reminder.findByIdAndDelete(id);
    if (!reminder) return c.json({ error: "Reminder not found" }, 404);
    return c.json({ message: "Reminder deleted" });
  } catch (error) {
    return c.json({ error: "Failed to delete reminder" }, 400);
  }
});

// Inventory Routes
app.get("/api/inventory", async (c) => {
  try {
    const inventory = await Inventory.find().sort({ createdAt: -1 });
    return c.json(inventory);
  } catch (error) {
    return c.json({ error: "Failed to fetch inventory" }, 500);
  }
});

app.post("/api/inventory", async (c) => {
  try {
    const body = await c.req.json();
    const item = new Inventory(body);
    await item.save();
    return c.json(item, 201);
  } catch (error) {
    return c.json({ error: "Failed to create inventory item" }, 400);
  }
});

app.put("/api/inventory/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const item = await Inventory.findByIdAndUpdate(id, body, { new: true });
    if (!item) return c.json({ error: "Item not found" }, 404);
    return c.json(item);
  } catch (error) {
    return c.json({ error: "Failed to update item" }, 400);
  }
});

app.delete("/api/inventory/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const item = await Inventory.findByIdAndDelete(id);
    if (!item) return c.json({ error: "Item not found" }, 404);
    return c.json({ message: "Item deleted" });
  } catch (error) {
    return c.json({ error: "Failed to delete item" }, 400);
  }
});

const PORT = process.env.PORT || 3000;

export default {
  port: PORT,
  fetch: app.fetch,
};

console.log(`🚀 Server running on http://localhost:${PORT}`);
