#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações padrão para desenvolvimento
const defaultEnv = `# Configurações da API
VITE_API_BASE_URL=http://localhost:8080
VITE_API_PATH=/hex/api

# Endpoints específicos
VITE_API_PERSON_ENDPOINT=/person
VITE_API_PERSON_ALL_ENDPOINT=/person/all
VITE_API_PERSON_EXISTS_ENDPOINT=/person/exists
VITE_API_DEPENDENT_TYPE_ENDPOINT=/dependent/dependent-type

# Configurações do proxy (desenvolvimento)
VITE_PROXY_TARGET=http://localhost:8080
`;

// Configurações para produção
const productionEnv = `# Configurações da API - PRODUÇÃO
VITE_API_BASE_URL=https://api.seudominio.com
VITE_API_PATH=/hex/api

# Endpoints específicos
VITE_API_PERSON_ENDPOINT=/person
VITE_API_PERSON_ALL_ENDPOINT=/person/all
VITE_API_PERSON_EXISTS_ENDPOINT=/person/exists
VITE_API_DEPENDENT_TYPE_ENDPOINT=/dependent/dependent-type

# Configurações do proxy (produção)
VITE_PROXY_TARGET=https://api.seudominio.com
`;

// Configurações para staging
const stagingEnv = `# Configurações da API - STAGING
VITE_API_BASE_URL=https://staging-api.seudominio.com
VITE_API_PATH=/hex/api

# Endpoints específicos
VITE_API_PERSON_ENDPOINT=/person
VITE_API_PERSON_ALL_ENDPOINT=/person/all
VITE_API_PERSON_EXISTS_ENDPOINT=/person/exists
VITE_API_DEPENDENT_TYPE_ENDPOINT=/dependent/dependent-type

# Configurações do proxy (staging)
VITE_PROXY_TARGET=https://staging-api.seudominio.com
`;

function createEnvFile(environment = 'development') {
  const envPath = path.join(process.cwd(), '.env');
  
  let content;
  switch (environment) {
    case 'production':
      content = productionEnv;
      break;
    case 'staging':
      content = stagingEnv;
      break;
    default:
      content = defaultEnv;
  }
  
  // Verifica se o arquivo já existe
  if (fs.existsSync(envPath)) {
    console.log('⚠️  Arquivo .env já existe. Deseja sobrescrever? (y/N)');
    process.stdin.once('data', (data) => {
      const answer = data.toString().trim().toLowerCase();
      if (answer === 'y' || answer === 'yes') {
        writeEnvFile(envPath, content, environment);
      } else {
        console.log('❌ Operação cancelada.');
        process.exit(0);
      }
    });
  } else {
    writeEnvFile(envPath, content, environment);
  }
}

function writeEnvFile(envPath, content, environment) {
  try {
    fs.writeFileSync(envPath, content);
    console.log(`✅ Arquivo .env criado com sucesso para o ambiente: ${environment}`);
    console.log(`📁 Localização: ${envPath}`);
    console.log('\n📝 Lembre-se de:');
    console.log('   - Ajustar as URLs conforme seu ambiente');
    console.log('   - Não commitar o arquivo .env no repositório');
    console.log('   - Usar .env.example como template');
  } catch (error) {
    console.error('❌ Erro ao criar arquivo .env:', error.message);
    process.exit(1);
  }
}

// Execução do script
const args = process.argv.slice(2);
const environment = args[0] || 'development';

console.log(`🚀 Configurando ambiente: ${environment}`);
createEnvFile(environment); 