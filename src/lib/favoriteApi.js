import { api } from './apiConfig';

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