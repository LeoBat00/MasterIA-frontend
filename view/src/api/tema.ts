import axios from 'axios';

export const getTemas = async () => {
  try {
    const response = await axios.get('https://localhost:7226/Tema');
    return response.data; // array de { id, nmTema }
  } catch (error) {
    console.error('Erro ao buscar temas:', error);
    return [];
  }
};
