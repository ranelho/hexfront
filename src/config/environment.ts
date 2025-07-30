import { getEnvironmentConfig } from './environments';

// Configurações de ambiente
export const environment = {
  // URLs base da API (com fallback para variáveis de ambiente)
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || getEnvironmentConfig().apiBaseUrl,
  apiPath: import.meta.env.VITE_API_PATH || getEnvironmentConfig().apiPath,
  
  // Endpoints específicos
  endpoints: {
    person: import.meta.env.VITE_API_PERSON_ENDPOINT || '/person',
    personAll: import.meta.env.VITE_API_PERSON_ALL_ENDPOINT || '/person/all',
    personExists: import.meta.env.VITE_API_PERSON_EXISTS_ENDPOINT || '/person/exists',
    dependentType: import.meta.env.VITE_API_DEPENDENT_TYPE_ENDPOINT || '/dependent/dependent-type',
  },
  
  // Configurações do proxy (desenvolvimento)
  proxyTarget: import.meta.env.VITE_PROXY_TARGET || getEnvironmentConfig().proxyTarget,
  useProxy: getEnvironmentConfig().useProxy,
  
  // Configurações gerais
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

// Log das configurações carregadas
console.log('🔧 Configurações de Ambiente Carregadas:', {
  apiBaseUrl: environment.apiBaseUrl,
  apiPath: environment.apiPath,
  endpoints: environment.endpoints,
  proxyTarget: environment.proxyTarget,
  useProxy: environment.useProxy,
  mode: environment.mode,
  isDevelopment: environment.isDevelopment,
});

// Função para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = environment.apiPath;
  const fullUrl = `${baseUrl}${endpoint}`;
  console.log('🔗 Construindo URL:', { baseUrl, endpoint, fullUrl });
  return fullUrl;
};

// Função para construir URL completa com base externa (para desenvolvimento)
export const buildExternalApiUrl = (endpoint: string): string => {
  const baseUrl = environment.apiBaseUrl;
  const apiPath = environment.apiPath;
  return `${baseUrl}${apiPath}${endpoint}`;
};

// Configurações do Axios
export const axiosConfig = {
  baseURL: environment.apiPath,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
};

// Função para obter configuração completa do ambiente atual
export const getCurrentEnvironment = () => {
  return {
    ...environment,
    config: getEnvironmentConfig(),
  };
}; 