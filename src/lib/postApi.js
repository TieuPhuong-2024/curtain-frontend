import { api } from './apiConfig';

export const getPosts = async (page = 1, limit = 10, status, tag) => {
    try {
        let url = `/posts?page=${page}&limit=${limit}`;
        if (status) url += `&status=${status}`;
        if (tag) url += `&tag=${tag}`;
        
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getPostById = async (id) => {
    try {
        const response = await api.get(`/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching post with id ${id}:`, error);
        throw error;
    }
};

export const createPost = async (postData) => {
    try {
        const response = await api.post('/posts', postData);
        return response.data;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const updatePost = async (id, postData) => {
    try {
        const response = await api.put(`/posts/${id}`, postData);
        return response.data;
    } catch (error) {
        console.error(`Error updating post with id ${id}:`, error);
        throw error;
    }
};

export const deletePost = async (id) => {
    try {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting post with id ${id}:`, error);
        throw error;
    }
}; 