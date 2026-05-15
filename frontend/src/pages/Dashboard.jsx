import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import IssueList from "../components/IssueList";
import CreateIssueModal from "../components/CreateIssueModal";
import ProjectSwitcher from "../components/ProjectSwitcher";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import CreateProjectModal from "../components/CreateProjectModal";
import IssueDetailsModal from "../components/IssueDetailsModal";
import InviteMemberModal from "../components/InviteMemberModal";
import api from "../config/api";
import { Plus, FolderKanban, Share2 } from "lucide-react";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [issues, setIssues] = useState([]);
    const [selectedIssueId, setSelectedIssueId] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (refreshTrigger === 0) setLoading(true);
                const [projRes] = await Promise.all([
                    api.get("/api/projects")
                ]);
                setProjects(projRes.data);

                let currentProject = selectedProject;
                if (projRes.data.length > 0 && !selectedProject) {
                    currentProject = projRes.data[0];
                    setSelectedProject(currentProject);
                }

                if (currentProject) {
                    const issRes = await api.get(`/api/issues/project/${currentProject.id}`);
                    setIssues(issRes.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [refreshTrigger, selectedProject?.id]);

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
        <div className="flex bg-slate-50 dark:bg-[#0f172a] min-h-screen text-slate-700 dark:text-slate-300 transition-colors">
            <Sidebar />

            <main className="ml-64 flex-1 p-8">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
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
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            disabled={!selectedProject?.id}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 disabled:opacity-30 disabled:hover:scale-100 border border-blue-500/30 rounded-lg text-sm font-bold text-blue-500 transition-all hover:scale-105"
                        >
                            <Share2 size={16} />
                            <span>Invite</span>
                        </button>
                    </div>
                </header>

                {selectedProject ? (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-xl">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                                    Total Issues
                                </p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white">{issues.length}</p>
                                <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                                    Across all categories
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-xl">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                                    Completed
                                </p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {issues.filter(i => i.status === 'done').length}
                                </p>
                                <div className="mt-2 text-xs text-green-600 dark:text-green-500/70">
                                    {issues.length > 0
                                        ? Math.round((issues.filter(i => i.status === 'done').length / issues.length) * 100)
                                        : 0}% done
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-xl">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
                                    In Progress
                                </p>
                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {issues.filter(i => i.status === 'in_progress').length}
                                </p>
                                <div className="mt-2 text-xs text-blue-600 dark:text-blue-500/70">
                                    Active tracking
                                </div>
                            </div>
                        </div>

                        <section className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Issues</h2>
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
                                issues={issues}
                                loading={loading}
                                onIssueClick={(id) => {
                                    setSelectedIssueId(id);
                                    setIsDetailsOpen(true);
                                }}
                                onCreateIssue={() => setIsIssueModalOpen(true)}
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

                <InviteMemberModal
                    isOpen={isInviteModalOpen}
                    onClose={() => setIsInviteModalOpen(false)}
                    projectId={selectedProject?.id}
                    onInvited={() => setRefreshTrigger(prev => prev + 1)}
                />

                <IssueDetailsModal
                    isOpen={isDetailsOpen}
                    onClose={() => setIsDetailsOpen(false)}
                    issueId={selectedIssueId}
                    onUpdate={handleIssueCreated}
                />
            </main>
        </div>
    );
};

export default Dashboard;
