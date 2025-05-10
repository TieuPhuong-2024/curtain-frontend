import { api } from './apiConfig';

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

export const searchCurtains = async (query) => {
    try {
        const response = await api.get(`/curtains/search?q=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        console.error(`Error searching curtains with query "${query}":`, error);
        throw error;
    }
}; 