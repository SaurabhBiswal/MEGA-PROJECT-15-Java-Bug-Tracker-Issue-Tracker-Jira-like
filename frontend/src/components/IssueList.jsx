import { useState, useEffect } from "react";
import api from "../config/api";
import { Plus, Filter, Search, MoreHorizontal, Ticket } from "lucide-react";

const IssueList = ({ projectId, onIssueClick, onCreateIssue, issues: initialIssues, loading: initialLoading }) => {
    const [issues, setIssues] = useState(initialIssues || []);
    const [loading, setLoading] = useState(initialLoading !== undefined ? initialLoading : true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (initialIssues) {
            setIssues(initialIssues);
            setLoading(initialLoading !== undefined ? initialLoading : false);
            return;
        }
        const fetchIssues = async () => {
            try {
                const response = await api.get(`/api/issues/project/${projectId}`);
                setIssues(response.data);
            } catch (error) {
                console.error("Error fetching issues:", error);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) fetchIssues();
    }, [projectId, initialIssues]);

    const filteredIssues = issues.filter(issue =>
        issue.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id?.toString().includes(searchQuery)
    );

    const getStatusColor = (status) => {
        switch (status) {
            case "done": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "in_progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none transition-colors">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search issues..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-colors"
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>
                <button
                    onClick={onCreateIssue}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                >
                    <Plus size={20} />
                    <span className="font-semibold">Create Issue</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
                            <th className="px-6 py-4 font-semibold text-xs">Title</th>
                            <th className="px-6 py-4 font-semibold text-xs">Status</th>
                            <th className="px-6 py-4 font-semibold text-xs">Priority</th>
                            <th className="px-6 py-4 font-semibold text-xs">Assignee</th>
                            <th className="px-6 py-4 font-semibold text-xs text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredIssues.length > 0 ? (
                            filteredIssues.map((issue) => (
                                <tr
                                    key={issue.id}
                                    className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                                    onClick={() => onIssueClick(issue.id)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 dark:text-white">{issue.title}</div>
                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase font-bold tracking-tighter">IS-{issue.id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(issue.status)}`}>
                                            {issue.status?.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-300 text-sm">{issue.priority}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm transition-all hover:scale-110">
                                                {issue.assignee?.fullName?.charAt(0) || "U"}
                                            </div>
                                            <span className="text-sm text-slate-600 dark:text-slate-300">{issue.assignee?.fullName || "Unassigned"}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-500 hover:text-white transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-20 text-center text-slate-500">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-600">
                                            <Ticket size={32} />
                                        </div>
                                        <p className="text-lg font-medium">
                                            {searchQuery ? "No matching issues" : "No issues found"}
                                        </p>
                                        <p className="text-sm">
                                            {searchQuery ? "Try adjusting your search query" : "Create your first ticket to get started."}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IssueList;
