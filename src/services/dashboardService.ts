import axios from 'axios';
import { buildApiUrl } from '../config/environment';

// Configuração do axios
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

export interface DashboardStats {
  totalPersons: number;
  totalAddresses: number;
  totalContacts: number;
  totalDependents: number;
  recentPersons: number;
  averageAge: number;
  personsByMonth: Array<{
    month: string;
    count: number;
  }>;
  topCities: Array<{
    city: string;
    count: number;
  }>;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const endpoint = buildApiUrl('/dashboard/stats');
  console.log('🔍 Dashboard - Chamando endpoint:', endpoint);
  const response = await api.get(endpoint);
  console.log('✅ Dashboard - Resposta recebida:', response.data);
  return response.data;
}

export async function getRecentPersons(limit: number = 5): Promise<any[]> {
  const endpoint = buildApiUrl(`/dashboard/recent-persons?limit=${limit}`);
  console.log('🔍 Recent Persons - Chamando endpoint:', endpoint);
  const response = await api.get(endpoint);
  console.log('✅ Recent Persons - Resposta recebida:', response.data);
  return response.data;
}

export async function getPersonsByMonth(): Promise<Array<{ month: string; count: number }>> {
  const endpoint = buildApiUrl('/dashboard/persons-by-month');
  const response = await api.get(endpoint);
  return response.data;
} 