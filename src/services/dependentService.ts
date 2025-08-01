import axios from 'axios';
import { environment, buildApiUrl } from '../config/environment';

export async function getDependentTypes() {
  const endpoint = buildApiUrl(environment.endpoints.dependentType);
  const res = await axios.get(endpoint);
  return res.data;
} 