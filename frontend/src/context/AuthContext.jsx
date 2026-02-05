import { createContext, useContext, useState, useEffect } from "react";
import api from "../config/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/signin", { email, password });
            const { jwt } = response.data;
            localStorage.setItem("jwt", jwt);
            // After login, we could fetch user profile, but for now we'll just set a placeholder or fetch if we had an endpoint
            // Let's assume we have /api/users/profile or similar later
            setUser({ email });
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await api.post("/auth/signup", userData);
            const { jwt } = response.data;
            localStorage.setItem("jwt", jwt);
            setUser({ email: userData.email });
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
            // Logic to verify token or fetch user profile could go here
            setUser({ loggedIn: true }); // Placeholder
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
