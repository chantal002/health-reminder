import { NavLink, Outlet } from "react-router-dom";
import { Bell, LayoutDashboard, Package } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { to: "/reminders", label: "Reminders", icon: <Bell size={18} /> },
  { to: "/inventory", label: "Inventory", icon: <Package size={18} /> },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex-col hidden md:flex">
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Bell size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">HealthTrack</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Bell size={14} className="text-white" />
          </div>
          <span className="font-bold text-gray-900">HealthTrack</span>
        </header>

        {/* Mobile nav */}
        <nav className="md:hidden bg-white border-b border-gray-200 flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                  isActive ? "text-indigo-600" : "text-gray-500"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
