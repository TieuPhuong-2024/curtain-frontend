import { api } from './apiConfig';

export const getProjects = async () => {
    try {
        const response = await api.get('/projects');
        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const getProjectById = async (id) => {
    try {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching project with id ${id}:`, error);
        throw error;
    }
};

export const createProject = async (projectData) => {
    try {
        const response = await api.post('/projects', projectData);
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};

export const updateProject = async (id, projectData) => {
    try {
        const response = await api.put(`/projects/${id}`, projectData);
        return response.data;
    } catch (error) {
        console.error(`Error updating project with id ${id}:`, error);
        throw error;
    }
};

export const deleteProject = async (id) => {
    try {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting project with id ${id}:`, error);
        throw error;
    }
};

export const getProjectsByType = async (type) => {
    try {
        const response = await api.get(`/projects/type/${type}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching projects of type ${type}:`, error);
        throw error;
    }
}; 