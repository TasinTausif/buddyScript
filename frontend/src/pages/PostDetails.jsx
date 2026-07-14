import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { getPost, updatePost, deletePost } from '../api/posts'
import { getImageUrl } from '../utils/imageUrl'

const PostDetails = () => {
    const { postId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [body, setBody] = useState('')
    const [visibility, setVisibility] = useState('public')
    const [imageFile, setImageFile] = useState(null)
    const [removeImage, setRemoveImage] = useState(false)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true)
                const data = await getPost(postId)
                setPost(data)
                setBody(data.body)
                setVisibility(data.visibility || 'public')
            } catch (error) {
                console.error(error.response?.data || error)
            } finally {
                setLoading(false)
            }
        }

        loadPost()
    }, [postId])

    const canEdit = post && user && post.user && user.id === post.user.id

    const handleSave = async e => {
        e.preventDefault()
        if (!canEdit) return

        const formData = new FormData()
        formData.append('body', body)
        formData.append('visibility', visibility)

        if (imageFile) {
            formData.append('image', imageFile)
        }

        if (removeImage) {
            formData.append('remove_image', '1')
        }

        try {
            setSaving(true)
            const updated = await updatePost(postId, formData)
            setPost(updated)
            setImageFile(null)
            setRemoveImage(false)
            navigate('/feed', { replace: true })
        } catch (error) {
            console.error(error.response?.data || error)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!canEdit || !confirm('Are you sure you want to delete this post?'))
            return

        try {
            setDeleting(true)
            await deletePost(postId)
            navigate('/feed', { replace: true })
        } catch (error) {
            console.error(error.response?.data || error)
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return <div className='text-center py-4'>Loading post...</div>
    }

    if (!post) {
        return <div className='text-center py-4'>Post not found.</div>
    }

    return (
        <div className='row justify-content-center mt-4'>
            <div className='col-lg-8'>
                <div className='card'>
                    <div className='card-body'>
                        <div className='mb-4'>
                            <div className='d-flex align-items-center gap-3 mb-3'>
                                <div className='_feed_inner_text_area_box_image'>
                                    <img src='/assets/images/profile.png' alt='Image' className='_txt_img' />
                                </div>
                                <h4>{post.user?.name}</h4>
                            </div>
                            <p className='text-muted'>
                                Visibility: {post.visibility}
                            </p>
                        </div>

                        {post.image && !imageFile && !removeImage && (
                            <div className='mb-4'>
                                <img
                                    src={getImageUrl(post.image)}
                                    className='img-fluid rounded'
                                    alt='Post'
                                />
                            </div>
                        )}

                        {imageFile && (
                            <div className='mb-4'>
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    className='img-fluid rounded'
                                    alt='New upload preview'
                                />
                            </div>
                        )}

                        {!canEdit ? (
                            <div>
                                <p className='lead' style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
                                <div className='d-flex gap-2 mt-4'>
                                    <button
                                        type='button'
                                        className='btn btn-outline-secondary'
                                        onClick={() => navigate(-1)}>
                                        Back
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSave}>
                                <div className='mb-3'>
                                    <label className='form-label'>
                                        Post content
                                    </label>
                                    <textarea
                                        className='form-control'
                                        rows='5'
                                        value={body}
                                        onChange={e => setBody(e.target.value)}
                                    />
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Visibility</label>
                                    <select
                                        className='form-select'
                                        value={visibility}
                                        onChange={e =>
                                            setVisibility(e.target.value)
                                        }>
                                        <option value='public'>Public</option>
                                        <option value='private'>Private</option>
                                    </select>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label'>Image</label>
                                    <input
                                        type='file'
                                        className='form-control'
                                        accept='image/*'
                                        onChange={e => {
                                            setImageFile(e.target.files[0] ?? null)
                                            setRemoveImage(false)
                                        }}
                                    />
                                </div>

                                {post.image && !imageFile && (
                                    <div className='form-check mb-3'>
                                        <input
                                            className='form-check-input'
                                            type='checkbox'
                                            id='removeImage'
                                            checked={removeImage}
                                            onChange={e =>
                                                setRemoveImage(e.target.checked)
                                            }
                                        />
                                        <label
                                            className='form-check-label'
                                            htmlFor='removeImage'>
                                            Remove current image
                                        </label>
                                    </div>
                                )}

                                <div className='d-flex gap-2'>
                                    <button
                                        className='btn btn-primary'
                                        type='submit'
                                        disabled={!canEdit || saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type='button'
                                        className='btn btn-outline-secondary'
                                        onClick={() => navigate(-1)}>
                                        Back
                                    </button>
                                    {canEdit && (
                                        <button
                                            type='button'
                                            className='btn btn-danger ms-auto'
                                            onClick={handleDelete}
                                            disabled={deleting}>
                                            {deleting
                                                ? 'Deleting...'
                                                : 'Delete Post'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetails
