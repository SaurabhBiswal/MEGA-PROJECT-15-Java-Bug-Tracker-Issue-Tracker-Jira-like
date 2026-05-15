import { LayoutDashboard, Ticket, FolderKanban, PlusCircle, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
        { icon: FolderKanban, label: "Projects", path: "/projects" },
        { icon: Ticket, label: "Issues", path: "/issues" },
        { icon: FolderKanban, label: "Kanban", path: "/kanban" },
    ];

    return (
        <div className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 fixed transition-colors">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-10 px-4">
                BugTracker
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                            ? "bg-blue-600 text-white"
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white"
                            }`}
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between px-4 py-2">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Theme</span>
                    <ThemeToggle />
                </div>
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-slate-500 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
