import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getMecanicas = async () => {
  try {
    const response = await axios.get(`${baseURL}/Mecanica`);
    return response.data; // array de { id, nmMecanica }
  } catch (error) {
    console.error('Erro ao buscar mecânicas:', error);
    return [];
  }
};
