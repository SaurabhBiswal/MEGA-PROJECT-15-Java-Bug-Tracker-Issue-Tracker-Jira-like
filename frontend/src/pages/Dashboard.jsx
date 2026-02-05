import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import IssueList from "../components/IssueList";
import CreateIssueModal from "../components/CreateIssueModal";
import ProjectSwitcher from "../components/ProjectSwitcher";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import CreateProjectModal from "../components/CreateProjectModal";
import api from "../config/api";
import { Plus, FolderKanban } from "lucide-react";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await api.get("/api/projects");
                setProjects(response.data);
                if (response.data.length > 0 && !selectedProject) {
                    setSelectedProject(response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [refreshTrigger]);

    const handleIssueCreated = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleProjectCreated = (newProject) => {
        setProjects([...projects, newProject]);
        setSelectedProject(newProject);
        setRefreshTrigger((prev) => prev + 1);
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
                        <h1 className="text-3xl font-bold text-white mb-3">
                            Project Overview
                        </h1>
                        <ProjectSwitcher
                            projects={projects}
                            selectedProject={selectedProject}
                            onSelect={setSelectedProject}
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-2">
                            {selectedProject?.team?.slice(0, 4).map((member, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-slate-900 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white"
                                >
                                    {member.fullName?.charAt(0) || "U"}
                                </div>
                            ))}
                            {selectedProject?.team?.length > 4 && (
                                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                                    +{selectedProject.team.length - 4}
                                </div>
                            )}
                        </div>
                        <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
                            Share
                        </button>
                    </div>
                </header>

                {selectedProject ? (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700/50 shadow-xl">
                                <p className="text-slate-400 text-sm font-medium mb-1">
                                    Total Issues
                                </p>
                                <p className="text-3xl font-bold text-white">24</p>
                                <div className="mt-2 text-xs text-slate-500">
                                    +3 from last week
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-900/20 to-slate-900 p-6 rounded-xl border border-green-700/30 shadow-xl">
                                <p className="text-slate-400 text-sm font-medium mb-1">
                                    Completed
                                </p>
                                <p className="text-3xl font-bold text-green-400">18</p>
                                <div className="mt-2 text-xs text-green-500/70">75% done</div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-900/20 to-slate-900 p-6 rounded-xl border border-blue-700/30 shadow-xl">
                                <p className="text-slate-400 text-sm font-medium mb-1">
                                    In Progress
                                </p>
                                <p className="text-3xl font-bold text-blue-400">6</p>
                                <div className="mt-2 text-xs text-blue-500/70">
                                    Active sprint
                                </div>
                            </div>
                        </div>

                        <section className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <h2 className="text-xl font-bold text-white">Recent Issues</h2>
                                <button
                                    onClick={() => setIsIssueModalOpen(true)}
                                    className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors flex items-center space-x-1"
                                >
                                    <Plus size={16} />
                                    <span>New Issue</span>
                                </button>
                            </div>

                            <IssueList
                                projectId={selectedProject.id}
                                key={`${selectedProject.id}-${refreshTrigger}`}
                            />
                        </section>
                    </div>
                ) : (
                    <EmptyState
                        icon={FolderKanban}
                        title="No Projects Found"
                        description="You haven't created any projects yet. Create a project to start tracking your issues."
                        action={
                            <button
                                onClick={() => setIsProjectModalOpen(true)}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl shadow-blue-600/20"
                            >
                                Create Your First Project
                            </button>
                        }
                    />
                )}

                {selectedProject && (
                    <CreateIssueModal
                        isOpen={isIssueModalOpen}
                        onClose={() => setIsIssueModalOpen(false)}
                        projectId={selectedProject.id}
                        onCreated={handleIssueCreated}
                    />
                )}

                <CreateProjectModal
                    isOpen={isProjectModalOpen}
                    onClose={() => setIsProjectModalOpen(false)}
                    onCreated={handleProjectCreated}
                />
            </main>
        </div>
    );
};

export default Dashboard;
