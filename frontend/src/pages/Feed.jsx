import { useState } from 'react'
import CreatePost from '../components/feed/CreatePost'
import PostList from '../components/feed/PostList'

const Feed = () => {
    const [refreshKey, setRefreshKey] = useState(0)
    const handlePostCreated = () => {
        setRefreshKey(prev => prev + 1)
    }

    return (
        <div className='row justify-content-center mt-4'>
            <div className='col-lg-8'>
                <CreatePost onPostCreated={handlePostCreated} />
                <div className='mt-4'>
                    <PostList refreshKey={refreshKey} />
                </div>
            </div>
        </div>
    )
}

export default Feed
