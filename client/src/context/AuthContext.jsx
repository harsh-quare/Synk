import { createContext, useState, useContext, useEffect } from 'react';
import axios from '../api/axios';

// Create authentication context
const AuthContext = createContext();

// Provider component to wrap the app and manage auth state
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check user session on initial mount
    useEffect(() => {
        const checkUserSession = async () => {
            try{
                // Call protected endpoint to verify session
                const response = await axios.get('/auth/profile');
                if(response.status === 200){
                    setUser(response.data);
                    setIsAuthenticated(true);
                }
            } 
            catch(err){
                setUser(null);
                setIsAuthenticated(false);
                console.log("No active session or session expired.", err.data);
            } 
            finally{
                setLoading(false);
            }
        };
        checkUserSession();
    }, []);

    // Login: update state with user data
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Logout: clear cookies and state
    const logout = async () => {
        try{
            await axios.post('/api/auth/logout');
        } 
        catch(err){
            console.error("Error logging out", err);
        } 
        finally{
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    // Context value for consumers
    const value = { user, isAuthenticated, login, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to access auth context
export function useAuth(){
    return useContext(AuthContext);
}