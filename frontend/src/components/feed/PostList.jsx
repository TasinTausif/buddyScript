import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PostCard from './PostCard'
import { getFeed, getMyPosts, searchPosts } from '../../api/posts'

const PostList = ({ refreshKey, mode = 'feed' }) => {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams] = useSearchParams()
    const query = mode === 'feed' ? searchParams.get('q') : null

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setLoading(true)
                let data
                if (query) {
                    data = await searchPosts(query)
                } else {
                    data = mode === 'mine' ? await getMyPosts() : await getFeed()
                }
                setPosts(data?.data ?? data ?? [])
            } catch (error) {
                console.error(error.response?.data || error)
            } finally {
                setLoading(false)
            }
        }

        loadPosts()
    }, [refreshKey, mode, query])

    const handlePostDeleted = postId => {
        setPosts(prev => prev.filter(p => p.id !== postId))
    }

    if (loading) {
        return <div className='text-center py-4'>Loading posts...</div>
    }

    if (!posts.length) {
        return <div className='text-center py-4'>No posts available.</div>
    }

    return (
        <>
            {posts.map(post => (
                <PostCard
                    key={post.id}
                    post={post}
                    onPostDeleted={handlePostDeleted}
                />
            ))}
        </>
    )
}

export default PostList
