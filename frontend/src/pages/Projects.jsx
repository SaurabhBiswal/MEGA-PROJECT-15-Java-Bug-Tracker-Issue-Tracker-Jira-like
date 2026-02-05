import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import CreateProjectModal from "../components/CreateProjectModal";
import api from "../config/api";
import { FolderKanban, Plus, Users, Tag } from "lucide-react";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get("/api/projects");
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const handleProjectCreated = (newProject) => {
        setProjects([...projects, newProject]);
    };

    if (loading) {
        return (
            <div className="flex bg-[#0f172a] min-h-screen">
                <Sidebar />
                <main className="ml-64 flex-1 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </main>
            </div>
        );
    }

    return (
        <div className="flex bg-[#0f172a] min-h-screen text-slate-300">
            <Sidebar />

            <main className="ml-64 flex-1 p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                        <p className="text-slate-400">
                            Manage all your projects in one place
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
                    >
                        <Plus size={20} />
                        <span>New Project</span>
                    </button>
                </header>

                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => navigate("/")}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group hover:shadow-xl hover:shadow-blue-500/10"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <FolderKanban className="text-white" size={24} />
                                    </div>
                                    <span className="px-3 py-1 bg-slate-800 text-slate-400 text-xs rounded-full">
                                        {project.category}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                                    {project.description || "No description provided"}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                    <div className="flex items-center space-x-1 text-slate-400 text-sm">
                                        <Users size={16} />
                                        <span>{project.team?.length || 0} members</span>
                                    </div>
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="flex items-center space-x-1 text-slate-400 text-sm">
                                            <Tag size={16} />
                                            <span>{project.tags.length} tags</span>
                                        </div>
                                    )}
                                </div>

                                {project.tags && project.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {project.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-md"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                        {project.tags.length > 3 && (
                                            <span className="px-2 py-1 bg-slate-800 text-slate-500 text-xs rounded-md">
                                                +{project.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={FolderKanban}
                        title="No Projects Yet"
                        description="Create your first project to start organizing your work and tracking issues."
                        action={
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl shadow-blue-600/20"
                            >
                                Create Project
                            </button>
                        }
                    />
                )}

                <CreateProjectModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onCreated={handleProjectCreated}
                />
            </main>
        </div>
    );
};

export default Projects;
