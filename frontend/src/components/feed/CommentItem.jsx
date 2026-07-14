import { useEffect, useMemo, useRef, useState } from 'react'
import { toggleCommentLike } from '../../api/comments'
import useAuth from '../../hooks/useAuth'

const CommentItem = ({
    comment,
    onReplyAdded,
    onUpdate,
    onDelete,
    defaultRepliesVisible = false,
}) => {
    const [loading, setLoading] = useState(false)
    const [liked, setLiked] = useState(() => {
        return localStorage.getItem(`comment-liked-${comment.id}`) === 'true'
    })
    const [likes, setLikes] = useState(comment.likes_count ?? 0)
    const [replying, setReplying] = useState(false)
    const [replyText, setReplyText] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [editText, setEditText] = useState(comment.body)
    const [menuOpen, setMenuOpen] = useState(false)
    const [showReplies, setShowReplies] = useState(defaultRepliesVisible)
    const menuRef = useRef(null)
    const { user } = useAuth()
    const canModify = user && comment.user && user.id === comment.user.id

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

    useEffect(() => {
        const handleDocumentClick = event => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleDocumentClick)
        return () => document.removeEventListener('mousedown', handleDocumentClick)
    }, [])

    useEffect(() => {
        setShowReplies(defaultRepliesVisible)
    }, [defaultRepliesVisible, comment.id])

    const visibleReplies = useMemo(() => {
        const sorted = [...(comment.replies ?? [])].sort((a, b) => {
            return new Date(b.created_at || 0) - new Date(a.created_at || 0)
        })

        return showReplies ? sorted : sorted.slice(0, 1)
    }, [comment.replies, showReplies])

    const hiddenReplyCount = Math.max((comment.replies?.length ?? 0) - 1, 0)

    const handleLike = async () => {
        if (loading) return

        try {
            setLoading(true)
            const response = await toggleCommentLike(comment.id)
            const nextLiked = response.liked ?? !liked
            setLiked(nextLiked)
            localStorage.setItem(`comment-liked-${comment.id}`, String(nextLiked))
            setLikes(response.likes_count ?? (nextLiked ? likes + 1 : likes - 1))
        } catch (error) {
            console.error(error.response?.data || error)
        } finally {
            setLoading(false)
        }
    }

    const handleReplyToggle = () => setReplying(prev => !prev)

    const handleReplySubmit = async e => {
        e.preventDefault()
        if (!replyText.trim()) return
        await onReplyAdded?.(comment.id, replyText)
        setReplyText('')
        setReplying(false)
        setShowReplies(true)
    }

    const handleStartEdit = () => {
        setMenuOpen(false)
        setIsEditing(true)
        setEditText(comment.body)
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditText(comment.body)
    }

    const handleUpdateSubmit = async e => {
        e.preventDefault()
        if (!editText.trim()) return
        await onUpdate?.(comment.id, editText)
        setIsEditing(false)
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure delete this?')) return
        setMenuOpen(false)
        await onDelete?.(comment.id)
    }

    return (
        <div className='mb-3 ps-3 border-start border-2 border-light'>
            <div className='_comment_main'>
                <div className='_comment_image'>
                    <img
                        src='/assets/images/profile.png'
                        alt='Profile'
                        className='_comment_img1'
                    />
                </div>

                <div className='_comment_area'>
                    <div className='_comment_details' style={{ minWidth: '280px' }}>
                        <div className='_comment_details_top'>
                            <div className='_comment_name'>
                                <a href='#0' onClick={e => e.preventDefault()}>
                                    <h4 className='_comment_name_title'>
                                        {comment.user?.name ?? 'Unknown'}
                                    </h4>
                                </a>
                            </div>

                            {canModify && (
                                <div
                                    className='_feed_inner_timeline_post_box_dropdown position-relative flex-shrink-0'
                                    ref={menuRef}>
                                    <button
                                        type='button'
                                        className='btn btn-sm btn-light border-0 shadow-none px-2'
                                        aria-label='comment options'
                                        onClick={() => setMenuOpen(prev => !prev)}>
                                        <span style={{ fontSize: 22, lineHeight: 1 }}>
                                            ...
                                        </span>
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
                                                <li className='_feed_timeline_dropdown_item'>
                                                    <a
                                                        href='#0'
                                                        className='_feed_timeline_dropdown_link'
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            handleStartEdit()
                                                        }}>
                                                        <span>
                                                            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 18 18'>
                                                                <path stroke='#1890FF' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.2' d='M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75'/>
                                                                <path stroke='#1890FF' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.2' d='M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z'/>
                                                            </svg>
                                                        </span>
                                                        Edit
                                                    </a>
                                                </li>
                                                <li className='_feed_timeline_dropdown_item'>
                                                    <a
                                                        href='#0'
                                                        className='_feed_timeline_dropdown_link'
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            handleDelete()
                                                        }}>
                                                        <span>
                                                            <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 18 18'>
                                                                <path stroke='#1890FF' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.2' d='M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5'/>
                                                            </svg>
                                                        </span>
                                                        Delete
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className='_comment_status'>
                            <p className='_comment_status_text'>
                                <span>{comment.body}</span>
                            </p>
                        </div>

                        <div className='_comment_reply'>
                            <div className='_comment_reply_num'>
                                <ul className='_comment_reply_list'>
                                    <li>
                                        <span
                                            onClick={handleLike}
                                            style={{
                                                cursor: loading
                                                    ? 'not-allowed'
                                                    : 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                            }}
                                            className={`comment-action-link ${
                                                liked ? 'text-danger fw-bold' : ''
                                            }`}>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                width='14'
                                                height='14'
                                                viewBox='0 0 24 24'
                                                fill={liked ? 'red' : 'none'}
                                                stroke={liked ? 'red' : 'currentColor'}
                                                strokeWidth='2'
                                                strokeLinecap='round'
                                                strokeLinejoin='round'>
                                                <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
                                            </svg>
                                            <span style={{ fontWeight: 600 }}>{likes}</span>
                                        </span>
                                    </li>
                                    <li>
                                        <span
                                            className='comment-action-link'
                                            onClick={handleReplyToggle}>
                                            Reply.
                                        </span>
                                    </li>
                                    <li>
                                        <span className='_time_link'>
                                            {formatRelativeTime(comment.created_at)}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <form onSubmit={handleUpdateSubmit} className='mb-3'>
                    <textarea
                        className='form-control mb-2'
                        rows='2'
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                    />
                    <div className='d-flex gap-2'>
                        <button className='btn btn-sm btn-primary' type='submit'>
                            Update
                        </button>
                        <button
                            type='button'
                            className='btn btn-sm btn-outline-secondary'
                            onClick={handleCancelEdit}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {replying && (
                <form onSubmit={handleReplySubmit} className='mb-3'>
                    <div className='d-flex align-items-center gap-2 rounded-pill border px-3 py-2 bg-light'>
                        <img
                            src='/assets/images/profile.png'
                            alt='You'
                            className='rounded-circle'
                            style={{ width: 26, height: 26, objectFit: 'cover' }}
                        />
                        <input
                            className='form-control border-0 bg-transparent shadow-none'
                            placeholder='Write a reply...'
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                        />
                        <button
                            className='btn btn-sm btn-primary rounded-pill px-3'
                            type='submit'>
                            Reply
                        </button>
                    </div>
                </form>
            )}

            {!!comment.replies?.length && (
                <div className='mt-3'>
                    {!showReplies && hiddenReplyCount > 0 && (
                        <button
                            type='button'
                            className='btn btn-link px-0 text-decoration-none mb-3'
                            onClick={() => setShowReplies(true)}>
                            View {hiddenReplyCount} more repl
                            {hiddenReplyCount === 1 ? 'y' : 'ies'}
                        </button>
                    )}

                    {visibleReplies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReplyAdded={onReplyAdded}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            defaultRepliesVisible={false}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default CommentItem
