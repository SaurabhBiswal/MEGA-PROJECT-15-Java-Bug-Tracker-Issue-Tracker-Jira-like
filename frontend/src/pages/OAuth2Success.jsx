import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const OAuth2Success = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth(); // We'll add this to AuthContext

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            loginWithToken(token);
            navigate("/");
        } else {
            navigate("/login?error=oauth2_failed");
        }
    }, [searchParams]);

    return (
        <div className="h-screen w-screen bg-[#0f172a] flex items-center justify-center">
            <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-slate-400 font-bold tracking-widest animate-pulse">AUTHENTICATING WITH GOOGLE...</p>
            </div>
        </div>
    );
};

export default OAuth2Success;
