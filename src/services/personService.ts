import axios from 'axios';
import { environment, buildApiUrl } from '../config/environment';

// Configuração do axios sem baseURL
const api = axios.create({
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
    console.log('📤 Request:', config.method?.toUpperCase(), config.url, config.params);
    console.log('📤 Request Headers:', config.headers);
    console.log('📤 Request Data (Detailed):', JSON.stringify(config.data, null, 2));
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    console.log('📥 Response Headers:', response.headers);
    console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.response?.status, error.response?.data);
    console.error('❌ Error URL:', error.config?.url);
    console.error('❌ Error Method:', error.config?.method);
    console.error('❌ Error Headers:', error.config?.headers);
    console.error('❌ Error Data (Detailed):', JSON.stringify(error.response?.data, null, 2));
    console.error('❌ Error Config Data:', JSON.stringify(error.config?.data, null, 2));
    
    // Log específico para erro 403
    if (error.response?.status === 403) {
      console.error('🚫 Erro 403 - Acesso Negado. Verificando configuração do proxy...');
      console.error('🚫 Request URL:', error.config?.url);
      console.error('🚫 Request Method:', error.config?.method);
      console.error('🚫 Request Data:', error.config?.data);
    }
    
    return Promise.reject(error);
  }
);

export async function getPersons(page = 0, size = 10, name?: string, cpf?: string) {
  const params: any = { page, size };
  if (name) params.name = name;
  if (cpf) params.cpf = cpf;

  console.log('🔍 Chamando API com params:', params);
  const endpoint = buildApiUrl(environment.endpoints.personAll);
  console.log('🔍 Endpoint completo:', endpoint);
  
  const res = await api.get(endpoint, { params });
  return res.data;
}

export async function getPerson(id: number) {
  const endpoint = buildApiUrl(`${environment.endpoints.person}/${id}`);
  const res = await api.get(endpoint);
  return res.data;
}

export async function createPerson(data: any) {
  const endpoint = buildApiUrl(environment.endpoints.person);
  const res = await api.post(endpoint, data);
  return res.data;
}

export async function updatePerson(id: number, data: any) {
  const endpoint = buildApiUrl(`${environment.endpoints.person}/${id}`);
  
  // Inclui todos os dados da pessoa para atualização
  const updateData = {
    name: data.name,
    cpf: data.cpf,
    rg: data.rg,
    rgIssuer: data.rgIssuer,
    birthDate: data.birthDate,
    nameMother: data.nameMother,
    nameFather: data.nameFather,
    maritalStatus: data.maritalStatus,
    profession: data.profession,
    nationality: data.nationality,
    gender: data.gender,
    emergencyContact: data.emergencyContact,
    emergencyPhone: data.emergencyPhone,
    addresses: data.addresses || [],
    contacts: data.contacts || [],
    dependents: data.dependents || []
  };
  
  console.log('🔧 Dados para atualização:', updateData);
  console.log('🔧 Endpoint completo:', endpoint);
  
  try {
    const res = await api.patch(endpoint, updateData);
    console.log('✅ Atualização bem-sucedida:', res.data);
    return res.data;
  } catch (error) {
    console.error('❌ Erro na atualização:', error);
    console.error('❌ Status:', error.response?.status);
    console.error('❌ Data:', error.response?.data);
    throw error;
  }
}

export async function deletePerson(id: number) {
  const endpoint = buildApiUrl(`${environment.endpoints.person}/${id}`);
  const res = await api.delete(endpoint);
  return res.data;
}

export async function checkCpfExists(cpf: string): Promise<boolean> {
  try {
    const endpoint = buildApiUrl(`${environment.endpoints.personExists}?cpf=${cpf}`);
    const res = await api.get(endpoint);
    return res.data;
  } catch (error) {
    console.error('❌ Erro ao verificar CPF:', error);
    return false;
  }
}

export const getMaritalStatuses = async (): Promise<{ value: string; label: string }[]> => {
  try {
    const endpoint = buildApiUrl('/enum/marital-status');
    console.log('🔍 Buscando estados civis em:', endpoint);
    const response = await api.get(endpoint);
    console.log('✅ Estados civis carregados:', response.data);
    
    // Transformar array de strings em objetos com value e label
    const transformedData = response.data.map((status: string) => ({
      value: status,
      label: status
    }));
    
    console.log('✅ Estados civis transformados:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('❌ Erro ao buscar estados civis:', error);
    return [];
  }
};

export const getGenders = async (): Promise<{ value: string; label: string }[]> => {
  try {
    const endpoint = buildApiUrl('/enum/gender');
    console.log('🔍 Buscando gêneros em:', endpoint);
    const response = await api.get(endpoint);
    console.log('✅ Gêneros carregados:', response.data);
    
    // Transformar array de strings em objetos com value e label
    const transformedData = response.data.map((gender: string) => ({
      value: gender,
      label: gender
    }));
    
    console.log('✅ Gêneros transformados:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('❌ Erro ao buscar gêneros:', error);
    return [];
  }
};
