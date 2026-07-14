import { createBrowserRouter } from 'react-router-dom'

import GuestRoute from '../components/GuestRoute'
import ProtectedRoute from '../components/ProtectedRoute'
import Layout from '../components/Layout'

import Login from '../pages/Login'
import Register from '../pages/Register'
import Feed from '../pages/Feed'
import MyPosts from '../pages/MyPosts'
import PostDetails from '../pages/PostDetails'

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
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: '/feed',
                element: <Feed />,
            },
            {
                path: '/my-posts',
                element: <MyPosts />,
            },
            {
                path: '/posts/:postId',
                element: <PostDetails />,
            },
        ],
    },
])

export default router
