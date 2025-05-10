import { api } from './apiConfig';

export const getColors = async () => {
    try {
        const response = await api.get('/colors');
        return response.data;
    } catch (error) {
        console.error('Error fetching colors:', error);
        throw error;
    }
};

export const createColor = async (colorData) => {
    try {
        const response = await api.post('/colors', colorData);
        return response.data;
    } catch (error) {
        console.error('Error creating color:', error);
        throw error;
    }
};

export const getColorById = async (id) => {
    try {
        const response = await api.get(`/colors/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching color with id ${id}:`, error);
        throw error;
    }
};

export const updateColor = async (id, colorData) => {
    try {
        const response = await api.put(`/colors/${id}`, colorData);
        return response.data;
    } catch (error) {
        console.error(`Error updating color with id ${id}:`, error);
        throw error;
    }
}; 