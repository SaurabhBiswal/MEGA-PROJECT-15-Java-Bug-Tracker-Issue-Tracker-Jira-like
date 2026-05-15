import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import CreateProjectModal from "../components/CreateProjectModal";
import InviteMemberModal from "../components/InviteMemberModal";
import api from "../config/api";
import { FolderKanban, Plus, Users, Tag, Trash2, UserPlus } from "lucide-react";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/projects");
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleProjectCreated = (newProject) => {
        fetchProjects(); // Better to fetch all as team might change
    };

    const handleDeleteProject = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this project?")) {
            try {
                await api.delete(`/api/projects/${id}`);
                setProjects(projects.filter((p) => p.id !== id));
            } catch (error) {
                console.error("Error deleting project:", error);
            }
        }
    };

    const handleOpenInvite = (e, id) => {
        e.stopPropagation();
        setSelectedProjectId(id);
        setIsInviteModalOpen(true);
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
        <div className="flex bg-slate-50 dark:bg-[#0f172a] min-h-screen text-slate-700 dark:text-slate-300 transition-colors">
            <Sidebar />

            <main className="ml-64 flex-1 p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Projects</h1>
                        <p className="text-slate-500 dark:text-slate-400">
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
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group hover:shadow-xl dark:hover:shadow-blue-500/10 shadow-sm dark:shadow-none"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <FolderKanban className="text-white" size={24} />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={(e) => handleOpenInvite(e, project.id)}
                                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                                            title="Invite Member"
                                        >
                                            <UserPlus size={18} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteProject(e, project.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Delete Project"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {project.name}
                                </h3>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                                    {project.description || "No description provided"}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-sm">
                                        <Users size={16} />
                                        <span>{project.team?.length || 0} members</span>
                                    </div>
                                    {project.tags && project.tags.length > 0 && (
                                        <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 text-sm">
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

                <InviteMemberModal
                    isOpen={isInviteModalOpen}
                    onClose={() => setIsInviteModalOpen(false)}
                    projectId={selectedProjectId}
                    onInvited={fetchProjects}
                />
            </main>
        </div>
    );
};

export default Projects;
