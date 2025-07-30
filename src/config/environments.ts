// Configurações específicas para diferentes ambientes
export const environments = {
  development: {
    apiBaseUrl: 'http://localhost:8080',
    apiPath: '/hex/api',
    proxyTarget: 'http://localhost:8080',
    useProxy: true,
  },
  
  production: {
    apiBaseUrl: 'https://api.seudominio.com',
    apiPath: '/hex/api',
    proxyTarget: 'https://api.seudominio.com',
    useProxy: false,
  },
  
  staging: {
    apiBaseUrl: 'https://staging-api.seudominio.com',
    apiPath: '/hex/api',
    proxyTarget: 'https://staging-api.seudominio.com',
    useProxy: false,
  },
};

// Função para obter configuração baseada no ambiente atual
export const getEnvironmentConfig = () => {
  const mode = import.meta.env.MODE;
  
  switch (mode) {
    case 'production':
      return environments.production;
    case 'staging':
      return environments.staging;
    default:
      return environments.development;
  }
};

// Função para verificar se está em desenvolvimento
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

// Função para verificar se está em produção
export const isProduction = () => {
  return import.meta.env.PROD;
}; 