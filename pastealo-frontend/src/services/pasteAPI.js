import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/paste';

// funciones get
export const getAllPastes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getPasteById = async (id) => {
    try {
        const response = await axios.get(API_URL + '/' + id);
        return response.data;
    } catch (error) {
        throw error;
    }
}


// funcion post
export const postPasteApi = async (id, text, attachments) => {
    const data = {
        "paste_key": id,
        "text": text,
        "last_used": new Date().toISOString(),
        "attachments": attachments
    };
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// funcion para subir archivos
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await axios.post(API_URL + '/upload', formData);
        return response.data.file_info;
    } catch (error) {
        console.error(error);
    }
}