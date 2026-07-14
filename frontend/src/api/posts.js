import api from '../api'

export const getFeed = async (page = 1) => {
    const response = await api.get('/feed', {
        params: { page },
    })
    return response.data.data
}

export const getMyPosts = async (page = 1) => {
    const response = await api.get('/my-posts', {
        params: { page },
    })
    return response.data.data
}

export const getPost = async postId => {
    const response = await api.get(`/posts/${postId}`)
    return response.data.data
}

export const createPost = async formData => {
    const response = await api.post('/posts', formData)
    return response.data.data
}

export const togglePostLike = async postId => {
    const response = await api.post(`/posts/${postId}/like`)
    return response.data
}

export const updatePost = async (postId, data) => {
    if (data instanceof FormData) {
        data.append('_method', 'PUT')
        const response = await api.post(`/posts/${postId}`, data)
        return response.data.data
    }
    const response = await api.put(`/posts/${postId}`, data)
    return response.data.data
}

export const deletePost = async postId => {
    const response = await api.delete(`/posts/${postId}`)
    return response.data
}

export const searchPosts = async (query, page = 1) => {
    const response = await api.get('/posts/search', {
        params: { q: query, page },
    })
    return response.data.data
}
