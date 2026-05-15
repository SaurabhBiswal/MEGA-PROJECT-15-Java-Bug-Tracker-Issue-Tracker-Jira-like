import { useState } from "react";
import { X, Mail, Send } from "lucide-react";
import api from "../config/api";

const InviteMemberModal = ({ isOpen, onClose, projectId, onInvited }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    if (!isOpen || !projectId) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });
        setLoading(true);

        try {
            await api.post(`/api/projects/${projectId}/invite?email=${email}`);
            setMessage({ type: "success", text: "Invitation sent successfully!" });
            if (onInvited) onInvited();
            setTimeout(() => {
                onClose();
                setEmail("");
                setMessage({ type: "", text: "" });
            }, 1500);
        } catch (error) {
            console.error("Error inviting user:", error);
            let errorMsg = error.response?.data?.message || error.response?.data;
            if (typeof errorMsg === 'object') {
                errorMsg = errorMsg.error || JSON.stringify(errorMsg);
            }
            setMessage({ type: "error", text: errorMsg || "An unexpected error occurred." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Invite Team Member</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Enter the email address of the user you want to add to this project.
                    </p>

                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                placeholder="colleague@example.com"
                            />
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded-lg text-xs font-bold uppercase tracking-wider ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send size={18} />
                                    <span>Send Invitation</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteMemberModal;
