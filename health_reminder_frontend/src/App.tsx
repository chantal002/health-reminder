import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import DashboardPage from "@/pages/DashboardPage";
import RemindersPage from "@/pages/RemindersPage";
import InventoryPage from "@/pages/InventoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="reminders" element={<RemindersPage />} />
          <Route path="inventory" element={<InventoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
