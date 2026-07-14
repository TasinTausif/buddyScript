import PostList from '../components/feed/PostList'
import { useState } from 'react'

export default function MyPosts() {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <div className='container py-4'>
            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <h4 className='mb-3'>My Posts</h4>
                    <PostList refreshKey={refreshKey} mode='mine' />
                </div>
            </div>
        </div>
    )
}
