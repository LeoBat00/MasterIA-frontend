import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getTemas = async () => {
  try {
    const response = await axios.get(`${baseURL}/Tema`);
    return response.data; // array de { id, nmTema }
  } catch (error) {
    console.error('Erro ao buscar temas:', error);
    return [];
  }
};
