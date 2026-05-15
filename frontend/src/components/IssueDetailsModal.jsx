import { useState, useEffect } from "react";
import { X, Send, Trash2, Clock, User as UserIcon, AlertCircle, Edit2, Calendar, Check, Camera, Image as ImageIcon, Loader2 } from "lucide-react";
import api from "../config/api";
import LoadingSpinner from "./LoadingSpinner";

const IssueDetailsModal = ({ isOpen, onClose, issueId, onUpdate }) => {
    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        title: "",
        description: "",
        priority: "",
        dueDate: "",
        assigneeId: ""
    });

    useEffect(() => {
        if (isOpen && issueId) {
            fetchDetails();
        }
        setIsEditing(false);
    }, [isOpen, issueId]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const [issueRes, commentsRes] = await Promise.all([
                api.get(`/api/issues/${issueId}`),
                api.get(`/api/comments/${issueId}`),
            ]);
            setIssue(issueRes.data);
            setComments(commentsRes.data);
        } catch (error) {
            console.error("Error fetching issue details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmitting(true);
            const response = await api.post("/api/comments", {
                content: newComment,
                issue: { id: issueId },
            });
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/api/comments/${commentId}`);
            setComments(comments.filter((c) => c.id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleDeleteIssue = async () => {
        if (window.confirm("Are you sure you want to delete this issue?")) {
            try {
                await api.delete(`/api/issues/${issueId}`);
                onUpdate();
                onClose();
            } catch (error) {
                console.error("Error deleting issue:", error);
            }
        }
    };

    const handleEditToggle = () => {
        setEditData({
            title: issue.title,
            description: issue.description,
            priority: issue.priority || "Medium",
            dueDate: issue.dueDate || "",
            assigneeId: issue.assignee?.id || ""
        });
        setIsEditing(!isEditing);
    };

    const handleUpdateIssue = async (e) => {
        e.preventDefault();
        try {
            // First update basic info
            const updateObj = {
                ...issue,
                title: editData.title,
                description: editData.description,
                priority: editData.priority,
                dueDate: editData.dueDate
            };

            // Note: The backend might need different endpoints for assignee
            const response = await api.put(`/api/issues/${issueId}`, updateObj);

            // If assignee changed
            if (editData.assigneeId && editData.assigneeId !== issue.assignee?.id) {
                await api.put(`/api/issues/${issueId}/assignee/${editData.assigneeId}`);
            }

            fetchDetails(); // Refresh everything
            setIsEditing(false);
            onUpdate();
        } catch (error) {
            console.error("Error updating issue:", error);
        }
    };

    const updateStatus = async (newStatus) => {
        try {
            await api.put(`/api/issues/${issueId}/status/${newStatus}`);
            fetchDetails();
            onUpdate();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setSubmitting(true);
            await api.post(`/api/issues/${issueId}/screenshot`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            fetchDetails();
            onUpdate();
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center space-x-3">
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wider font-bold">ISSUE-{issueId}</span>
                        {!isEditing ? (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${issue?.priority?.toLowerCase() === 'critical' ? 'border-red-500/50 bg-red-500/10 text-red-500' :
                                issue?.priority?.toLowerCase() === 'high' ? 'border-orange-500/50 bg-orange-500/10 text-orange-500' :
                                    'border-slate-200 dark:border-slate-500/50 bg-slate-50 dark:bg-slate-500/10 text-slate-500 dark:text-slate-400'
                                }`}>
                                {issue?.priority || 'Medium'}
                            </span>
                        ) : (
                            <select
                                value={editData.priority}
                                onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                                className="text-[10px] font-bold border rounded px-2 py-1 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 outline-none"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {!isEditing && (
                            <button
                                onClick={handleEditToggle}
                                className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                                title="Edit Issue"
                            >
                                <Edit2 size={20} />
                            </button>
                        )}
                        <button
                            onClick={handleDeleteIssue}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete Issue"
                        >
                            <Trash2 size={20} />
                        </button>
                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2" />
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-2">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center py-20">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : (
                    <div className="flex-1 flex overflow-hidden">
                        {/* Left: Issue Content */}
                        <div className="flex-1 p-8 overflow-y-auto border-r border-slate-100 dark:border-slate-800 custom-scrollbar bg-white dark:bg-slate-900">
                            {isEditing ? (
                                <form onSubmit={handleUpdateIssue} className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={editData.title}
                                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center space-y-2">
                                        <Camera className="text-slate-400" size={24} />
                                        <label className="text-sm font-bold text-slate-500 cursor-pointer hover:text-blue-500">
                                            {submitting ? "Uploading..." : "Upload Screenshot"}
                                            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                        </label>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Description</label>
                                        <textarea
                                            rows="5"
                                            value={editData.description}
                                            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Assignee</label>
                                            <select
                                                value={editData.assigneeId}
                                                onChange={(e) => setEditData({ ...editData, assigneeId: e.target.value })}
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                                            >
                                                <option value="">Unassigned</option>
                                                {issue?.project?.team?.map(user => (
                                                    <option key={user.id} value={user.id}>{user.fullName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Due Date</label>
                                            <input
                                                type="date"
                                                value={editData.dueDate}
                                                onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
                                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 pt-4">
                                        <button type="submit" className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
                                            Save Changes
                                        </button>
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-10 animate-in fade-in duration-300">
                                    <div>
                                        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                                            {issue?.title}
                                        </h1>
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description</h3>
                                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-[15px]">
                                                {issue?.description || "No description provided."}
                                            </p>
                                        </div>
                                    </div>

                                    {issue?.screenshotUrl && (
                                        <div className="py-8 border-t border-slate-50 dark:border-slate-800/50">
                                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Screenshot</h3>
                                            <div className="relative group/img overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl">
                                                <img
                                                    src={`http://localhost:8080${issue.screenshotUrl}`}
                                                    alt="Issue Screenshot"
                                                    className="w-full h-auto object-cover max-h-[400px] transition-transform duration-500 group-hover/img:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                    <a
                                                        href={`http://localhost:8080${issue.screenshotUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-white text-slate-900 rounded-full shadow-2xl scale-75 group-hover/img:scale-100 transition-transform"
                                                    >
                                                        <ImageIcon size={20} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-10 py-8 border-t border-slate-50 dark:border-slate-800/50">
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Assignee</h3>
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-blue-500/20">
                                                    {issue?.assignee?.fullName?.charAt(0) || "U"}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{issue?.assignee?.fullName || "Unassigned"}</span>
                                                    <span className="text-[10px] text-slate-400">Team Member</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Due Date</h3>
                                            <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                                                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                                    <Clock size={18} className="text-slate-400" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">{issue?.dueDate ? new Date(issue.dueDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : "No deadline"}</span>
                                                    <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Timeline</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-50 dark:border-slate-800/50">
                                        <div className="flex items-center space-x-6">
                                            <div className="flex flex-col space-y-4">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workflow State</span>
                                                <div className="flex space-x-2">
                                                    {["pending", "in_progress", "done"].map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => updateStatus(status)}
                                                            className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border ${issue?.status === status
                                                                ? "bg-blue-600 text-white border-blue-600"
                                                                : "bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-blue-500"
                                                                }`}
                                                        >
                                                            {status.replace('_', ' ')}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Comments Section */}
                        <div className="w-[400px] flex flex-col bg-slate-50/30 dark:bg-slate-900/40 backdrop-blur-sm">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center space-x-3">
                                    <span>Comments</span>
                                    <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-lg text-[10px]">{comments.length}</span>
                                </h3>
                            </div>

                            {/* Comment List */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                {comments.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400/50">
                                        <AlertCircle size={40} className="mb-4 opacity-10" />
                                        <p className="text-[11px] font-bold uppercase tracking-tighter">No discussions yet</p>
                                    </div>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="group animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            <div className="flex items-start space-x-4">
                                                <div className="shrink-0 w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm transition-transform group-hover:scale-110">
                                                    <UserIcon size={16} className="text-slate-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline mb-1.5">
                                                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">{comment.user?.fullName}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 ml-2">
                                                            {new Date(comment.createdDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="relative group/text">
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-800/50 p-3 rounded-2xl rounded-tl-none border border-slate-100/50 dark:border-transparent shadow-sm transition-all group-hover:shadow-md">
                                                            {comment.content}
                                                        </p>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="absolute -right-2 -top-2 opacity-0 group-hover/text:opacity-100 p-1.5 bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500 rounded-full shadow-lg border border-slate-100 dark:border-slate-600 transition-all scale-75 hover:scale-100"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Comment Input */}
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/80">
                                <form onSubmit={handleAddComment} className="relative group">
                                    <textarea
                                        rows="1"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full pl-5 pr-14 py-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-[13px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 resize-none overflow-hidden transition-all shadow-inner"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleAddComment(e);
                                            }
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting || !newComment.trim()}
                                        className="absolute right-3 top-3 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                                    >
                                        <Send size={16} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IssueDetailsModal;
