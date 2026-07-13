import { createContext, useEffect, useState } from 'react';
import {
    loginUser,
    registerUser,
    logoutUser,
} from '../api/auth';

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const response = await loginUser(credentials);

        const user = response.data.user;
        const token = response.data.token;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        setToken(token);

        return response;
    };

    const register = async (data) => {
        const response = await registerUser(data);

        const user = response.data.user;
        const token = response.data.token;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        setToken(token);

        return response;
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (e) {}

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                authenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}