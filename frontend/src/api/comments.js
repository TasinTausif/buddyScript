import api from '../api'

export const addComment = async (postId, data) => {
    const response = await api.post(`/posts/${postId}/comments`, data)
    return response.data.data
}

export const toggleCommentLike = async commentId => {
    const response = await api.post(`/comments/${commentId}/like`)
    return response.data
}
export const updateComment = async (commentId, body) => {
    const response = await api.put(`/comments/${commentId}`, { body })
    return response.data.data
}

export const deleteComment = async commentId => {
    const response = await api.delete(`/comments/${commentId}`)
    return response.data
}
