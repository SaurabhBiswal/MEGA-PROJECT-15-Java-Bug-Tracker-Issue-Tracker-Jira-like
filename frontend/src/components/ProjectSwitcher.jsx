import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, FolderKanban } from "lucide-react";

const ProjectSwitcher = ({ projects, selectedProject, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-white min-w-[200px] justify-between"
            >
                <div className="flex items-center space-x-2">
                    <FolderKanban size={16} className="text-blue-400" />
                    <span className="font-medium truncate">
                        {selectedProject?.name || "Select Project"}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-2xl z-50 max-h-[300px] overflow-y-auto">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <button
                                key={project.id}
                                onClick={() => {
                                    onSelect(project);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors flex items-center justify-between ${selectedProject?.id === project.id ? "bg-slate-700/50" : ""
                                    }`}
                            >
                                <div>
                                    <div className="font-medium text-white">{project.name}</div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        {project.category} • {project.team?.length || 0} members
                                    </div>
                                </div>
                                {selectedProject?.id === project.id && (
                                    <Check size={16} className="text-blue-400" />
                                )}
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center text-slate-500">
                            No projects found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectSwitcher;
