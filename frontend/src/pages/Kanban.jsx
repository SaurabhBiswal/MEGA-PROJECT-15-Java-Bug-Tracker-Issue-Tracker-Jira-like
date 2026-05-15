import { useState, useEffect } from "react";
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Sidebar from "../components/Sidebar";
import KanbanColumn from "../components/KanbanColumn";
import IssueCard from "../components/IssueCard";
import ProjectSwitcher from "../components/ProjectSwitcher";
import CreateIssueModal from "../components/CreateIssueModal";
import IssueDetailsModal from "../components/IssueDetailsModal";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import api from "../config/api";
import { Plus, FolderKanban } from "lucide-react";

const Kanban = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [selectedIssueId, setSelectedIssueId] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

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
                const response = await api.get(`/api/issues/project/${selectedProject.id}`);
                setIssues(response.data);
            } catch (error) {
                console.error("Error fetching issues:", error);
            }
        };
        fetchIssues();
    }, [selectedProject]);

    const handleIssueCreated = () => {
        if (selectedProject) {
            api
                .get(`/api/issues/project/${selectedProject.id}`)
                .then((res) => setIssues(res.data))
                .catch((err) => console.error(err));
        }
    };

    const getIssuesByStatus = (status) => {
        return issues.filter((issue) => issue.status === status);
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeIdValue = active.id;
        const overIdValue = over.id;

        const activeIssue = issues.find((issue) => issue.id === activeIdValue);
        if (!activeIssue) return;

        // Resolve new status
        let newStatus = overIdValue;
        const overIssue = issues.find((issue) => issue.id === overIdValue);
        if (overIssue) {
            newStatus = overIssue.status;
        }

        const validStatuses = ["pending", "in_progress", "done"];
        if (!validStatuses.includes(newStatus)) return;

        // Logic for sorting vs moving
        if (activeIssue.status === newStatus) {
            // Reorder within the same column
            if (activeIdValue !== overIdValue) {
                setIssues((items) => {
                    const oldIndex = items.findIndex((i) => i.id === activeIdValue);
                    const newIndex = items.findIndex((i) => i.id === overIdValue);
                    return arrayMove(items, oldIndex, newIndex);
                });
            }
            return;
        }

        // Optimistic update for inter-column move
        setIssues((prevIssues) =>
            prevIssues.map((issue) =>
                issue.id === activeIdValue ? { ...issue, status: newStatus } : issue
            )
        );

        // Update backend
        try {
            await api.put(`/api/issues/${activeIdValue}/status/${newStatus}`);
        } catch (error) {
            console.error("Error updating issue status:", error);
            setIssues((prevIssues) =>
                prevIssues.map((issue) =>
                    issue.id === activeIdValue ? { ...issue, status: activeIssue.status } : issue
                )
            );
        }
    };

    const handleIssueClick = (id) => {
        setSelectedIssueId(id);
        setIsDetailsOpen(true);
    };

    const activeIssue = activeId ? issues.find((issue) => issue.id === activeId) : null;

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
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Kanban Board</h1>
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
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex gap-6 overflow-x-auto pb-4">
                            <KanbanColumn
                                id="pending"
                                title="To Do"
                                issues={getIssuesByStatus("pending")}
                                color="blue"
                                onIssueClick={handleIssueClick}
                            />
                            <KanbanColumn
                                id="in_progress"
                                title="In Progress"
                                issues={getIssuesByStatus("in_progress")}
                                color="yellow"
                                onIssueClick={handleIssueClick}
                            />
                            <KanbanColumn
                                id="done"
                                title="Done"
                                issues={getIssuesByStatus("done")}
                                color="green"
                                onIssueClick={handleIssueClick}
                            />
                        </div>

                        <DragOverlay>
                            {activeIssue ? (
                                <div className="rotate-3 scale-105">
                                    <IssueCard issue={activeIssue} />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                ) : (
                    <EmptyState
                        icon={FolderKanban}
                        title="Select a Project"
                        description="Choose a project from the dropdown to view its Kanban board"
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

export default Kanban;
