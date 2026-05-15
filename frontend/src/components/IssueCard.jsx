import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Clock, AlertCircle } from "lucide-react";

const IssueCard = ({ issue, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: issue.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case "critical":
                return "text-red-500 bg-red-500/10 border-red-500/20";
            case "high":
                return "text-orange-500 bg-orange-500/10 border-orange-500/20";
            case "medium":
                return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            case "low":
                return "text-green-500 bg-green-500/10 border-green-500/20";
            default:
                return "text-slate-500 bg-slate-500/10 border-slate-500/20";
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            {...attributes}
            {...listeners}
            className={`bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-all group shadow-sm dark:shadow-none ${isDragging ? "shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500 z-50" : ""
                }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs text-slate-500 font-mono">IS-{issue.id}</span>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getPriorityColor(
                                issue.priority
                            )}`}
                        >
                            {issue.priority}
                        </span>
                    </div>
                    <h4 className="text-slate-900 dark:text-white font-medium text-sm leading-snug line-clamp-2">
                        {issue.title}
                    </h4>
                </div>
                <div
                    className="text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400 transition-colors ml-2"
                >
                    <GripVertical size={18} />
                </div>
            </div>

            {issue.description && (
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-3 line-clamp-2">{issue.description}</p>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                {issue.assignee ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                            {issue.assignee.fullName?.charAt(0) || "U"}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{issue.assignee.fullName}</span>
                    </div>
                ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-600 italic">Unassigned</span>
                )}

                {issue.dueDate && (
                    <div className="flex items-center space-x-1 text-slate-500">
                        <Clock size={12} />
                        <span className="text-xs">{new Date(issue.dueDate).toLocaleDateString()}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueCard;
