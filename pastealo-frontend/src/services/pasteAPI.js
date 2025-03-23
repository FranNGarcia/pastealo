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

// funcion para borrar archivos
export const deleteFile = async (fileURL, resource_type) => {
    //limpio el url
    fileURL = fileURL.split('/');
    fileURL = fileURL[fileURL.length - 1];
    //elimino la extension
    fileURL = fileURL.split('.')[0];

    //limpio resource_type porque solo acepta 3 tipos de formatos (los audios deben ser tratados como videos)
    resource_type = resource_type.split('/')[0];
    switch (resource_type) {
        case 'image':
            resource_type = 'image';
            break;
        case 'video':
            resource_type = 'video';
            break;
        case 'audio':
            resource_type = 'video';
            break;
        default:
            resource_type = 'raw';
            break;
    }
    try {
        const response = await axios.delete(`${API_URL}/deletefile/?public_id=${fileURL}&resource_type=${resource_type}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}