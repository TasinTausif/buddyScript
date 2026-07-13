import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function GuestRoute({ children }) {
    const { authenticated, loading } = useAuth();

    if (loading) return null;

    return authenticated ? <Navigate to="/feed" replace /> : children;
}