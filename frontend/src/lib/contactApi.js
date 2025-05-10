import { api } from './apiConfig';

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

export const deleteContact = async (id) => {
    try {
        const response = await api.delete(`/contacts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting contact:', error);
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