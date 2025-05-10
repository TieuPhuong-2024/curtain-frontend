import { uploadApi, api, API_URL } from './apiConfig';

// Upload image from device
export const uploadImage = async (imageFile) => {
    try {
        console.log('uploadImage function called with:', imageFile.name);
        const formData = new FormData();
        formData.append('image', imageFile);
        
        console.log('Sending to:', `${API_URL}/upload/from-device`);
        
        const response = await uploadApi.post('/upload/from-device', formData);
        console.log('Raw upload response:', response);
        
        // Normalize result for CKEditor
        let result;
        
        if (response && response.data) {
            if (response.data.url) {
                result = {
                    url: response.data.url,
                    default: response.data.url
                };
            } else if (typeof response.data === 'string') {
                result = {
                    url: response.data,
                    default: response.data
                };
            } else {
                result = {
                    url: typeof response.data === 'object' 
                        ? JSON.stringify(response.data) 
                        : String(response.data),
                    default: API_URL + '/upload/image-error'
                };
            }
        } else {
            throw new Error('No data in upload response');
        }
        
        console.log('Normalized upload result:', result);
        return result;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// Upload video from device
export const uploadVideo = async (videoFile) => {
    try {
        console.log('uploadVideo function called with:', videoFile.name);
        const formData = new FormData();
        formData.append('video', videoFile);
        
        console.log('Sending to:', `${API_URL}/upload/video`);
        
        const response = await uploadApi.post('/upload/video', formData);
        console.log('Raw upload response:', response);
        
        // Normalize result for CKEditor
        let result;
        
        if (response && response.data) {
            if (response.data.url) {
                result = {
                    url: response.data.url,
                    default: response.data.url
                };
            } else if (typeof response.data === 'string') {
                result = {
                    url: response.data,
                    default: response.data
                };
            } else {
                result = {
                    url: typeof response.data === 'object' 
                        ? JSON.stringify(response.data) 
                        : String(response.data),
                    default: API_URL + '/upload/video-error'
                };
            }
        } else {
            throw new Error('No data in upload response');
        }
        
        console.log('Normalized video upload result:', result);
        return result;
    } catch (error) {
        console.error('Error uploading video:', error);
        throw error;
    }
};

// Upload multiple images from device
export const uploadImagesFromDevice = async (files) => {
    try {
        const formData = new FormData();
        
        // Append all files to formData with the name 'images'
        files.forEach(file => {
            formData.append('images', file);
        });
        
        const response = await uploadApi.post('/upload/multiple-from-device', formData);
        return response.data;
    } catch (error) {
        console.error('Error uploading images from device:', error);
        throw error;
    }
};

// Upload image from URL
export const uploadImageFromUrl = async (imageUrl) => {
    try {
        const response = await api.post('/upload/from-url', { imageUrl });
        return response.data;
    } catch (error) {
        console.error('Error uploading image from URL:', error);
        throw error;
    }
}; 