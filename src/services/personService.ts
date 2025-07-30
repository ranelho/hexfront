import axios from 'axios';

// Configuração do axios usando proxy do Vite
const api = axios.create({
  baseURL: '/hex/api', // Usando proxy do Vite
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log('Request:', config.method?.toUpperCase(), config.url, config.params);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export async function getPersons(page = 0, size = 10, name?: string, cpf?: string) {
  const params: any = { page, size };
  if (name) params.name = name;
  if (cpf) params.cpf = cpf;
  
  console.log('Chamando API com params:', params);
  const res = await api.get('/person/all', { params });
  return res.data;
}

export async function getPerson(id: number) {
  const res = await api.get(`/person/${id}`);
  return res.data;
}

export async function createPerson(data: any) {
  const res = await api.post('/person', data);
  return res.data;
}

export async function updatePerson(id: number, data: any) {
  const res = await api.put(`/person/${id}`, data);
  return res.data;
}

export async function deletePerson(id: number) {
  const res = await api.delete(`/person/${id}`);
  return res.data;
}

export async function checkCpfExists(cpf: string): Promise<boolean> {
  try {
    const res = await api.get(`/person/exists?cpf=${cpf}`);
    return res.data;
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    return false;
  }
}
