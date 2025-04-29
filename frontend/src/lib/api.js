import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

import { auth } from './firebase';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: tự động đính Authorization header nếu user đã đăng nhập
api.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const idToken = await user.getIdToken();
        config.headers['Authorization'] = `Bearer ${idToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Create a separate instance for file uploads
const uploadApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const getCurtains = async () => {
    try {
        const response = await api.get('/curtains');
        return response.data;
    } catch (error) {
        console.error('Error fetching curtains:', error);
        throw error;
    }
};

export const getCurtainById = async (id) => {
    try {
        const response = await api.get(`/curtains/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching curtain with id ${id}:`, error);
        throw error;
    }
};

export const createCurtain = async (curtainData) => {
    try {
        const response = await api.post('/curtains', curtainData);
        return response.data;
    } catch (error) {
        console.error('Error creating curtain:', error);
        throw error;
    }
};

export const updateCurtain = async (id, curtainData) => {
    try {
        const response = await api.put(`/curtains/${id}`, curtainData);
        return response.data;
    } catch (error) {
        console.error(`Error updating curtain with id ${id}:`, error);
        throw error;
    }
};

export const deleteCurtain = async (id) => {
    try {
        const response = await api.delete(`/curtains/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting curtain with id ${id}:`, error);
        throw error;
    }
};

export const getBanners = async () => {
    try {
        const response = await api.get('/banners');
        return response.data;
    } catch (error) {
        console.error('Error fetching banners:', error);
        throw error;
    }
};

export const createBanner = async (bannerData) => {
    try {
        const response = await api.post('/banners', bannerData);
        return response.data;
    } catch (error) {
        console.error('Error creating banner:', error);
        throw error;
    }
};

export const updateBanner = async (id, bannerData) => {
    try {
        const response = await api.put(`/banners/${id}`, bannerData);
        return response.data;
    } catch (error) {
        console.error(`Error updating banner with id ${id}:`, error);
        throw error;
    }
};

export const deleteBanner = async (id) => {
    try {
        const response = await api.delete(`/banners/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting banner with id ${id}:`, error);
        throw error;
    }
};

export const getCategories = async () => {
    try {
        const response = await api.get('/categories');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await api.post('/categories', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error(`Error updating category with id ${id}:`, error);
        throw error;
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting category with id ${id}:`, error);
        throw error;
    }
};

// Upload image from device
export const uploadImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await uploadApi.post('/upload/from-device', formData);
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// Image APIs
export const getImagesByCurtainId = async (curtainId) => {
    try {
        const response = await api.get(`/images/curtain/${curtainId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching images for curtain ${curtainId}:`, error);
        throw error;
    }
};

export const addImageToCurtain = async (curtainId, imageData) => {
    try {
        const response = await api.post(`/images/curtain/${curtainId}`, imageData);
        return response.data;
    } catch (error) {
        console.error(`Error adding image to curtain ${curtainId}:`, error);
        throw error;
    }
};

export const updateImage = async (imageId, imageData) => {
    try {
        const response = await api.put(`/images/${imageId}`, imageData);
        return response.data;
    } catch (error) {
        console.error(`Error updating image ${imageId}:`, error);
        throw error;
    }
};

export const deleteImage = async (imageId) => {
    try {
        const response = await api.delete(`/images/${imageId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting image ${imageId}:`, error);
        throw error;
    }
};

export const favoriteService = {
    getFavoriteByUserId: async (userId) => {
        try {
            const response = await api.get(`/favorites/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching favorites by user ID:', error);
            throw error;
        }
    },
    getFavorites: async () => {
        try {
            const response = await api.get('/favorites');
            return response.data;
        } catch (error) {
            console.error('Error fetching favorites:', error);
            throw error;
        }
    },
    addFavorite: async (productId) => {
        try {
            const response = await api.post('/favorites', { productId });
            return response.data;
        } catch (error) {
            console.error('Error adding favorite:', error);
            throw error;
        }
    },
    removeFavorite: async (productId) => {
        try {
            const response = await api.delete(`/favorites/${productId}`);
            return response.data;
        } catch (error) {
            console.error('Error removing favorite:', error);
            throw error;
        }
    },
    countFavorites: async (id) => {
        try {
            const response = await api.get(`/favorites/count/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error counting favorites:', error);
            throw error;
        }
    }
};

// Contact API functions
export const getAllContacts = async () => {
    try {
        const response = await api.get('/contacts');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching contacts:', error);
        throw error;
    }
};

export const updateContactStatus = async (id, status) => {
    try {
        const response = await api.put(`/contacts/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating contact status:', error);
        throw error;
    }
};

export const createContact = async (contactData) => {
    try {
        const response = await api.post('/contacts', contactData);
        return response.data;
    } catch (error) {
        console.error('Error creating contact:', error);
        throw error;
    }
};

// Post APIs
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

export const searchCurtains = async (query) => {
    try {
        const response = await api.get(`/curtains/search?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error(`Error searching curtains with query "${query}":`, error);
        throw error;
    }
};