import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import CreateIssueModal from "../components/CreateIssueModal";
import ProjectSwitcher from "../components/ProjectSwitcher";
import api from "../config/api";
import { Ticket, Plus, Search, Filter } from "lucide-react";

const Issues = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get("/api/projects");
                setProjects(response.data);
                if (response.data.length > 0) {
                    setSelectedProject(response.data[0]);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    useEffect(() => {
        const fetchIssues = async () => {
            if (!selectedProject) return;
            try {
                const response = await api.get(
                    `/api/issues/project/${selectedProject.id}`
                );
                setIssues(response.data);
            } catch (error) {
                console.error("Error fetching issues:", error);
            }
        };
        fetchIssues();
    }, [selectedProject]);

    const filteredIssues = issues.filter((issue) =>
        issue.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleIssueCreated = () => {
        if (selectedProject) {
            api
                .get(`/api/issues/project/${selectedProject.id}`)
                .then((res) => setIssues(res.data))
                .catch((err) => console.error(err));
        }
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
                        <h1 className="text-3xl font-bold text-white mb-3">All Issues</h1>
                        <ProjectSwitcher
                            projects={projects}
                            selectedProject={selectedProject}
                            onSelect={setSelectedProject}
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={!selectedProject}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={20} />
                        <span>New Issue</span>
                    </button>
                </header>

                {selectedProject ? (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative flex-1 max-w-md">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search issues..."
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button className="flex items-center space-x-2 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors">
                                <Filter size={18} />
                                <span>Filters</span>
                            </button>
                        </div>

                        {filteredIssues.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredIssues.map((issue) => (
                                    <div
                                        key={issue.id}
                                        className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <span className="text-xs text-slate-500 font-mono">
                                                        IS-{issue.id}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${issue.status === "done"
                                                                ? "bg-green-500/10 text-green-500"
                                                                : issue.status === "in_progress"
                                                                    ? "bg-blue-500/10 text-blue-500"
                                                                    : "bg-yellow-500/10 text-yellow-500"
                                                            }`}
                                                    >
                                                        {issue.status?.replace("_", " ")}
                                                    </span>
                                                    <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-xs">
                                                        {issue.priority}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                                    {issue.title}
                                                </h3>
                                                <p className="text-slate-500 text-sm line-clamp-2">
                                                    {issue.description || "No description"}
                                                </p>
                                            </div>
                                            {issue.assignee && (
                                                <div className="flex items-center space-x-2 ml-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white">
                                                        {issue.assignee.fullName?.charAt(0) || "U"}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={Ticket}
                                title="No Issues Found"
                                description={
                                    searchQuery
                                        ? "No issues match your search criteria"
                                        : "Create your first issue to get started"
                                }
                                action={
                                    !searchQuery && (
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-xl shadow-blue-600/20"
                                        >
                                            Create Issue
                                        </button>
                                    )
                                }
                            />
                        )}
                    </div>
                ) : (
                    <EmptyState
                        icon={Ticket}
                        title="Select a Project"
                        description="Choose a project from the dropdown to view its issues"
                    />
                )}

                {selectedProject && (
                    <CreateIssueModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        projectId={selectedProject.id}
                        onCreated={handleIssueCreated}
                    />
                )}
            </main>
        </div>
    );
};

export default Issues;
