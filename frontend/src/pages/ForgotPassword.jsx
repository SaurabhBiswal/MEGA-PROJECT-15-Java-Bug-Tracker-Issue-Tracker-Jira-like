import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/api";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            await api.post("/auth/forgot-password", { email });
            setMessage({ type: "success", text: "Reset link sent! Please check your email." });
        } catch (error) {
            setMessage({ type: "error", text: error.response?.data?.message || "Failed to send reset link." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#0f172a] flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-2 text-center">Reset Password</h1>
                <p className="text-slate-500 text-center mb-8">Enter your email to receive a reset link</p>

                {message && (
                    <div className={`mb-4 p-3 border rounded-lg text-sm ${message.type === "success" ? "bg-green-500/10 border-green-500/50 text-green-500" : "bg-red-500/10 border-red-500/50 text-red-500"
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="name@company.com"
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <p className="text-center text-slate-500 mt-6 text-sm">
                    Remembered it? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
