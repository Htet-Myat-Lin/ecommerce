import { NavLink, Outlet } from "react-router-dom";
import { 
  BiSolidDashboard, 
  BiCategoryAlt, 
  BiLogOut, 
  BiChevronLeft 
} from "react-icons/bi";
import { LiaProductHunt } from "react-icons/lia";
import { useNotificationStore } from "../../store/notificationStore";

export function AdminLayout() {

  const unreadCount = useNotificationStore((s) => s.unreadCount)
  console.log("AdminLayout unreadCount:", unreadCount);

  const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <BiSolidDashboard size={20} /> },
  { to: "/admin/products", label: "Products", icon: <LiaProductHunt size={20} /> },
  { to: "/admin/categories", label: "Category", icon: <BiCategoryAlt size={20} /> }
];

  const activeClass = "bg-blue-50 text-blue-600 border-r-4 border-blue-600";
  const baseClass = "flex items-center gap-3 px-4 py-3 transition-all duration-200 hover:bg-gray-100 text-slate-600 font-medium";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="sticky top-0 h-screen bg-white shadow-sm border-r border-gray-200 w-[70px] sm:w-[260px] flex flex-col">
        {/* Sidebar Header / Logo */}
        <div className="p-6 border-b border-gray-100 hidden sm:block">
          <h1 className="text-xl font-bold text-slate-800">AdminPanel</h1>
        </div>

        <ul className="mt-4 flex-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `${baseClass} ${isActive ? activeClass : ""}`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="hidden sm:inline text-[15px]">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Bottom Actions */}
        <div className="border-t border-gray-100 py-4">
          <NavLink to="/" className={baseClass}>
            <BiChevronLeft size={20} />
            <span className="hidden sm:inline">Back to Site</span>
          </NavLink>
          <button className={`${baseClass} w-full text-red-500 hover:bg-red-50`}>
            <BiLogOut size={20} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden">

        <div className="p-4 sm:p-8">
          <div className="bg-white rounded-xl shadow-sm min-h-[calc(100vh-140px)] p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}