import axios from 'axios';

const API_URL = 'http://localhost:8080/hex/api/address';

export async function getAddressByCep(cep: string) {
  const res = await axios.get(`http://localhost:8080/hex/api/address/zip-code/${cep}`);
  return res.data;
}
