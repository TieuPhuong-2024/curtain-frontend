import { api } from './apiConfig';

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