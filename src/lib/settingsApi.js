import { api } from './apiConfig';

export const getSettings = async () => {
    try {
        const response = await api.get('/settings');
        return response.data;
    } catch (error) {
        console.error('Error fetching settings:', error);
        throw error;
    }
};

export const saveSettings = async (settings) => {
    try {
        const response = await api.put('/settings', { settings });
        return response.data;
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
};
