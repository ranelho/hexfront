import axios from 'axios';
import { environment, buildApiUrl } from '../config/environment';

export async function getAddressByCep(cep: string) {
  const endpoint = buildApiUrl(`/address/zip-code/${cep}`);
  const res = await axios.get(endpoint);
  return res.data;
}
