import { useEffect, useState } from 'react'
import api from '../api'
import PostCard from '../components/PostCard'
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Feed() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, logout } = useAuth();
const navigate = useNavigate();

    useEffect(() => {
        fetchFeed()
    }, [])

    const fetchFeed = async () => {
        try {
            const response = await api.get('/feed')
            setPosts(response.data.data.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
    await logout();
    navigate("/");
};

    return(
        <body>
            
        </body>
    )
}