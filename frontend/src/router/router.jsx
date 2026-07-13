import { createBrowserRouter } from 'react-router-dom';

import GuestRoute from '../components/GuestRoute';
import ProtectedRoute from '../components/ProtectedRoute';

import Login from '../pages/Login';
import Register from '../pages/Register';

const Feed = () => <h1>Feed</h1>;

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <GuestRoute>
                <Login />
            </GuestRoute>
        ),
    },
    {
        path: '/register',
        element: (
            <GuestRoute>
                <Register />
            </GuestRoute>
        ),
    },
    {
        path: '/feed',
        element: (
            <ProtectedRoute>
                <Feed />
            </ProtectedRoute>
        ),
    },
]);

export default router;