import { createContext, useEffect, useState } from 'react';
import {
    loginUser,
    registerUser,
    logoutUser,
} from '../api/auth';

export const AuthContext = createContext();

const readStoredUser = () => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
        return null;
    }

    try {
        return JSON.parse(storedUser);
    } catch (error) {
        localStorage.removeItem('user');
        return null;
    }
};

const readStoredToken = () => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken || storedToken === 'undefined' || storedToken === 'null') {
        return null;
    }

    return storedToken;
};

const getAuthPayload = response => {
    return response?.data?.data ?? response?.data ?? {};
};

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(() => readStoredUser());
    const [token, setToken] = useState(() => readStoredToken());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = readStoredUser();
        const storedToken = readStoredToken();

        setUser(storedUser);
        setToken(storedToken);

        if (!storedToken) {
            localStorage.removeItem('token');
        }

        if (!storedUser) {
            localStorage.removeItem('user');
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        const response = await loginUser(credentials);
        const payload = getAuthPayload(response);

        const user = payload.user;
        const token = payload.token;

        if (!user || !token) {
            throw new Error('Invalid auth response from server.');
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        setToken(token);

        return response;
    };

    const register = async (data) => {
        const response = await registerUser(data);
        const payload = getAuthPayload(response);

        const user = payload.user;
        const token = payload.token;

        if (!user || !token) {
            throw new Error('Invalid auth response from server.');
        }

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
