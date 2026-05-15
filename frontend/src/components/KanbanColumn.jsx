import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import IssueCard from "./IssueCard";

const KanbanColumn = ({ id, title, issues, color, onIssueClick }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    const getColorClasses = () => {
        switch (color) {
            case "blue":
                return "border-blue-500/50 bg-blue-500/5";
            case "yellow":
                return "border-yellow-500/50 bg-yellow-500/5";
            case "green":
                return "border-green-500/50 bg-green-500/5";
            default:
                return "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50";
        }
    };

    return (
        <div className="flex-1 min-w-[320px]">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
                <div className={`p-4 border-b ${getColorClasses()}`}>
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">{title}</h3>
                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs font-bold">
                            {issues.length}
                        </span>
                    </div>
                </div>

                <div
                    ref={setNodeRef}
                    className={`p-4 min-h-[500px] transition-colors ${isOver ? "bg-blue-500/10" : ""
                        }`}
                >
                    <SortableContext items={issues.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                        {issues.length > 0 ? (
                            issues.map((issue) => <IssueCard key={issue.id} issue={issue} onClick={() => onIssueClick(issue.id)} />)
                        ) : (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-slate-600">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                    <span className="text-2xl">📋</span>
                                </div>
                                <p className="text-sm">No issues</p>
                            </div>
                        )}
                    </SortableContext>
                </div>
            </div>
        </div>
    );
};

export default KanbanColumn;
