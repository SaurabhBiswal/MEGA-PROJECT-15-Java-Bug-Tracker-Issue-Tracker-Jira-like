import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-800 dark:bg-slate-700 text-yellow-500 dark:text-yellow-400 hover:scale-110 transition-all shadow-lg"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} className="text-blue-400" />}
        </button>
    );
};

export default ThemeToggle;
