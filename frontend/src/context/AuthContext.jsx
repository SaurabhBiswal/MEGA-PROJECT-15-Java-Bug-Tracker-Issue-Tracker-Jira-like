import { createContext, useContext, useState, useEffect } from "react";
import api from "../config/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (token) => {
        try {
            const response = await api.get("/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch profile:", error);
            logout();
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/signin", { email, password });
            const { jwt } = response.data;
            localStorage.setItem("jwt", jwt);
            await fetchProfile(jwt);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const loginWithToken = async (token) => {
        localStorage.setItem("jwt", token);
        await fetchProfile(token);
    };

    const signup = async (userData) => {
        try {
            const response = await api.post("/auth/signup", userData);
            const { jwt } = response.data;
            localStorage.setItem("jwt", jwt);
            await fetchProfile(jwt);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("jwt");
        setUser(null);
    };

    useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            fetchProfile(jwt).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, loginWithToken, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
