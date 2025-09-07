import axios from 'axios';

export const getMecanicas = async () => {
  try {
    const response = await axios.get('https://localhost:7226/Mecanica');
    return response.data; // array de { id, nmMecanica }
  } catch (error) {
    return [];
  }
};
