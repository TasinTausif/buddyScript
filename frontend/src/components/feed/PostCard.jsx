import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { getImageUrl } from '../../utils/imageUrl'
import { togglePostLike } from '../../api/posts'
import { addComment, updateComment, deleteComment } from '../../api/comments'
import CommentItem from './CommentItem'
import { deletePost } from '../../api/posts'

const PostCard = ({ post, onPostDeleted }) => {
    const navigate = useNavigate()
    const [liked, setLiked] = useState(() => {
        return localStorage.getItem(`post-liked-${post.id}`) === 'true'
    })
    const [likes, setLikes] = useState(post.likes_count ?? post.likes ?? 0)
    const [loading, setLoading] = useState(false)
    const [commentText, setCommentText] = useState('')
    const [comments, setComments] = useState(post.comments ?? [])
    const [postingComment, setPostingComment] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [showAllComments, setShowAllComments] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)
    const { user } = useAuth()
    const canModify = user && post.user && user.id === post.user.id
    const shouldTruncate = post.body?.length > 30
    const bodyPreview = shouldTruncate ? post.body.slice(0, 30) : post.body

    useEffect(() => {
        const handleDocumentClick = event => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleDocumentClick)
        return () => document.removeEventListener('mousedown', handleDocumentClick)
    }, [])

    const formatRelativeTime = timestamp => {
        if (!timestamp) return ''
        const then = new Date(timestamp).getTime()
        const now = Date.now()
        const sec = Math.floor((now - then) / 1000)

        if (sec < 60) return `${sec} second${sec !== 1 ? 's' : ''} ago`
        const min = Math.floor(sec / 60)
        if (min < 60) return `${min} minute${min !== 1 ? 's' : ''} ago`
        const hr = Math.floor(min / 60)
        if (hr < 24) return `${hr} hour${hr !== 1 ? 's' : ''} ago`
        const days = Math.floor(hr / 24)
        return `${days} day${days !== 1 ? 's' : ''} ago`
    }

    const totalComments = useMemo(() => {
        const countNested = items =>
            items.reduce((count, item) => {
                return count + 1 + countNested(item.replies ?? [])
            }, 0)

        return countNested(comments)
    }, [comments])

    const visibleComments = useMemo(() => {
        const sorted = [...comments].sort((a, b) => {
            return new Date(b.created_at || 0) - new Date(a.created_at || 0)
        })

        if (showAllComments) return sorted
        return sorted.length ? [sorted[0]] : []
    }, [comments, showAllComments])

    const handleToggleLike = async () => {
        if (loading) return

        try {
            setLoading(true)
            const response = await togglePostLike(post.id)
            const nextLiked = response.liked ?? !liked
            setLiked(nextLiked)
            localStorage.setItem(`post-liked-${post.id}`, String(nextLiked))
            setLikes(response.likes_count ?? (nextLiked ? likes + 1 : likes - 1))
        } catch (error) {
            console.error(error.response?.data || error)
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetails = () => {
        setMenuOpen(false)
        navigate(`/posts/${post.id}`)
    }

    const handleEdit = () => {
        setMenuOpen(false)
        navigate(`/posts/${post.id}`)
    }

    const handleDeletePost = async () => {
        if (!canModify) return
        if (!confirm('Are you sure delete this?')) return

        try {
            await deletePost(post.id)
            setMenuOpen(false)
            onPostDeleted?.(post.id)
            navigate('/feed', { replace: true })
        } catch (error) {
            console.error(error.response?.data || error)
        }
    }

    const insertReply = (items, parentId, reply) => {
        return items.map(item => {
            if (item.id === parentId) {
                return {
                    ...item,
                    replies: [...(item.replies ?? []), reply],
                }
            }

            if (item.replies?.length) {
                return {
                    ...item,
                    replies: insertReply(item.replies, parentId, reply),
                }
            }

            return item
        })
    }

    const handleAddComment = async e => {
        e.preventDefault()
        if (!commentText.trim()) return

        try {
            setPostingComment(true)
            const comment = await addComment(post.id, { body: commentText })
            setComments(prev => [comment, ...prev])
            setCommentText('')
            setShowAllComments(true)
        } catch (error) {
            console.error(error.response?.data || error)
        } finally {
            setPostingComment(false)
        }
    }

    const handleReplyAdded = async (parentId, body) => {
        if (!body.trim()) return

        try {
            const reply = await addComment(post.id, {
                body,
                parent_id: parentId,
            })
            setComments(prev => insertReply(prev, parentId, reply))
        } catch (error) {
            console.error(error.response?.data || error)
        }
    }

    const updateCommentInTree = (items, updated) => {
        return items.map(item => {
            if (item.id === updated.id) {
                return { ...item, ...updated }
            }

            if (item.replies?.length) {
                return {
                    ...item,
                    replies: updateCommentInTree(item.replies, updated),
                }
            }

            return item
        })
    }

    const removeCommentFromTree = (items, id) => {
        return items
            .map(item => ({
                ...item,
                replies: item.replies
                    ? removeCommentFromTree(item.replies, id)
                    : [],
            }))
            .filter(item => item.id !== id)
    }

    const handleUpdateComment = async (commentId, body) => {
        try {
            const updated = await updateComment(commentId, body)
            setComments(prev => updateCommentInTree(prev, updated))
        } catch (error) {
            console.error(error.response?.data || error)
        }
    }

    const handleDeleteComment = async commentId => {
        if (!confirm('Are you sure delete this?')) return

        try {
            await deleteComment(commentId)
            setComments(prev => removeCommentFromTree(prev, commentId))
        } catch (error) {
            console.error(error.response?.data || error)
        }
    }

    return (
        <div className='card mb-4 border-0 shadow-sm' style={{ borderRadius: 18 }}>
            {post.user && (
                <div className='card-header bg-white border-0 pt-3 pb-2 d-flex justify-content-between align-items-start'>
                    <div className='d-flex align-items-center gap-3'>
                        <img
                            src='/assets/images/profile.png'
                            alt='Profile'
                            className='rounded-circle'
                            style={{ width: 44, height: 44, objectFit: 'cover' }}
                        />
                        <div>
                            <strong className='d-block'>{post.user.name}</strong>
                            <div className='text-muted small'>
                                {formatRelativeTime(post.created_at)} ·{' '}
                                {post.visibility?.charAt(0).toUpperCase() +
                                    (post.visibility?.slice(1) ?? '')}
                            </div>
                        </div>
                    </div>

                    <div
                        className='_feed_inner_timeline_post_box_dropdown position-relative'
                        ref={menuRef}>
                        <button
                            type='button'
                            className='btn btn-sm btn-light border-0 shadow-none px-2'
                            aria-label='post options'
                            onClick={() => setMenuOpen(prev => !prev)}>
                            <span style={{ fontSize: 22, lineHeight: 1 }}>⋮</span>
                        </button>

                        {menuOpen && (
                            <div
                                id='_timeline_drop'
                                className='_feed_timeline_dropdown _timeline_dropdown show'
                                style={{
                                    right: 0,
                                    top: 'calc(100% + 8px)',
                                    zIndex: 100,
                                }}>
                                <ul className='_feed_timeline_dropdown_list'>
                                    {!canModify && (
                                        <li className='_feed_timeline_dropdown_item'>
                                            <a
                                                href='#0'
                                                className='_feed_timeline_dropdown_link'
                                                onClick={e => {
                                                    e.preventDefault()
                                                    handleViewDetails()
                                                }}>
                                                <span>
                                                    <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 18 18'>
                                                        <path stroke='#1890FF' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.2' d='M9 4.5a7.5 7.5 0 107.5 7.5A7.5 7.5 0 009 4.5zM9 7.5v3m0 3h.01' />
                                                    </svg>
                                                </span>
                                                View Details
                                            </a>
                                        </li>
                                    )}
                                    {canModify && (
                                        <>
                                            <li className='_feed_timeline_dropdown_item'>
                                                <a
                                                    href='#0'
                                                    className='_feed_timeline_dropdown_link'
                                                    onClick={e => {
                                                        e.preventDefault()
                                                        handleEdit()
                                                    }}>
                                                    <span>
                                                        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 18 18'>
                                                            <path stroke='#1890FF' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.2' d='M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75'/>
                                                            <path stroke='#1890FF' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.2' d='M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z'/>
                                                        </svg>
                                                    </span>
                                                    Edit Post
                                                </a>
                                            </li>
                                            <li className='_feed_timeline_dropdown_item'>
                                                <a
                                                    href='#0'
                                                    className='_feed_timeline_dropdown_link'
                                                    onClick={e => {
                                                        e.preventDefault()
                                                        handleDeletePost()
                                                    }}>
                                                    <span>
                                                        <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 18 18'>
                                                            <path stroke='#1890FF' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.2' d='M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5'/>
                                                        </svg>
                                                    </span>
                                                    Delete Post
                                                </a>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className='card-body pt-2'>
                {post.image && (
                    <div className='mb-3'>
                        <img
                            src={getImageUrl(post.image)}
                            className='w-100 rounded-4'
                            style={{
                                maxHeight: 460,
                                objectFit: 'cover',
                            }}
                            alt='Post'
                        />
                    </div>
                )}

                <p className='mb-3'>
                    {shouldTruncate && !expanded ? bodyPreview : post.body}
                    {shouldTruncate && !expanded && (
                        <span
                            className='text-primary'
                            style={{ cursor: 'pointer' }}
                            onClick={() => setExpanded(true)}>
                            ...
                        </span>
                    )}
                </p>

                <div className='d-flex flex-wrap gap-2 mb-3 align-items-center'>
                    <button
                        className={`btn ${liked ? 'btn-danger' : 'btn-outline-danger'} me-2`}
                        onClick={handleToggleLike}
                        disabled={loading}>
                        ❤️ {likes}
                    </button>
                    <button className='btn btn-outline-secondary'>
                        💬 {totalComments}
                    </button>
                </div>

                <form onSubmit={handleAddComment} className='mb-4'>
                    <div className='d-flex align-items-center gap-2 rounded-pill border px-3 py-2 bg-light'>
                        <img
                            src='/assets/images/profile.png'
                            alt='You'
                            className='rounded-circle'
                            style={{ width: 28, height: 28, objectFit: 'cover' }}
                        />
                        <input
                            className='form-control border-0 bg-transparent shadow-none'
                            style={{ minHeight: 36 }}
                            placeholder='Write a comment...'
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                        />
                        <button
                            className='btn btn-sm btn-primary rounded-pill px-3'
                            type='submit'
                            disabled={postingComment || !commentText.trim()}>
                            {postingComment ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>

                {comments?.length > 0 && (
                    <div className='mt-2'>
                        {!showAllComments && comments.length > 1 && (
                            <button
                                type='button'
                                className='btn btn-link px-0 text-decoration-none mb-3'
                                onClick={() => setShowAllComments(true)}>
                                View {comments.length - 1} previous comments
                            </button>
                        )}

                        {visibleComments.map((comment, index) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onReplyAdded={handleReplyAdded}
                                onUpdate={handleUpdateComment}
                                onDelete={handleDeleteComment}
                                defaultRepliesVisible={index === 0}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostCard
