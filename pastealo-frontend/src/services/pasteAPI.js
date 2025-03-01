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
        throw error; // Re-throw the error to be caught by the calling function
    }
}


// funcion post
export const postPasteApi = async (id, text) => {
    const data = {
        "paste_key": id,
        "text": text,
        "last_used": new Date().toISOString()
    };
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}