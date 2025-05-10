import { api } from './apiConfig';

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