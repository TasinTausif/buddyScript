import PostList from '../components/feed/PostList'
import { useState } from 'react'

export default function MyPosts() {
    const [refreshKey, setRefreshKey] = useState(0)

    return (
        <div className='container py-4 mt-2'>
            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <div className='_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div>
                                <h4 className='_title5 fw-bold mb-1' style={{ fontSize: '22px', color: 'var(--color6)' }}>My Posts</h4>
                                <p className='mb-0' style={{ fontSize: '13px', color: 'var(--color7)' }}>
                                    Manage, edit, or delete all your posts.
                                </p>
                            </div>
                        </div>
                    </div>
                    <PostList refreshKey={refreshKey} mode='mine' />
                </div>
            </div>
        </div>
    )
}
