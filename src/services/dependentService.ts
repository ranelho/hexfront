import axios from 'axios';

const API_URL = 'http://localhost:8080/hex/api/dependent';

export async function getDependentTypes() {
  const res = await axios.get(`${API_URL}/dependent-type`);
  return res.data;
} 