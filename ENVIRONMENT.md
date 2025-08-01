# Configuração de Variáveis de Ambiente

Este projeto utiliza variáveis de ambiente para configurar as URLs dos endpoints da API.

## Variáveis Disponíveis

### Configurações da API
- `VITE_API_BASE_URL`: URL base da API (padrão: `http://localhost:8080`)
- `VITE_API_PATH`: Caminho base da API (padrão: `/hex/api`)

### Endpoints Específicos
- `VITE_API_PERSON_ENDPOINT`: Endpoint para pessoas (padrão: `/person`)
- `VITE_API_PERSON_ALL_ENDPOINT`: Endpoint para listar todas as pessoas (padrão: `/person/all`)
- `VITE_API_PERSON_EXISTS_ENDPOINT`: Endpoint para verificar existência de CPF (padrão: `/person/exists`)
- `VITE_API_DEPENDENT_TYPE_ENDPOINT`: Endpoint para tipos de dependentes (padrão: `/dependent/dependent-type`)

### Configurações do Proxy (Desenvolvimento)
- `VITE_PROXY_TARGET`: URL de destino do proxy (padrão: `http://localhost:8080`)

## Como Configurar

1. Crie um arquivo `.env` na raiz do projeto
2. Adicione as variáveis necessárias:

```env
# Configurações da API
VITE_API_BASE_URL=http://localhost:8080
VITE_API_PATH=/hex/api

# Endpoints específicos
VITE_API_PERSON_ENDPOINT=/person
VITE_API_PERSON_ALL_ENDPOINT=/person/all
VITE_API_PERSON_EXISTS_ENDPOINT=/person/exists
VITE_API_DEPENDENT_TYPE_ENDPOINT=/dependent/dependent-type

# Configurações do proxy (desenvolvimento)
VITE_PROXY_TARGET=http://localhost:8080
```

## Ambientes

### Desenvolvimento
- Usa proxy do Vite para evitar problemas de CORS
- Configurações padrão para `localhost:8080`

### Produção
- Configurações específicas para o servidor de produção
- Sem proxy, chamadas diretas para a API

## Uso no Código

As variáveis são acessadas através do arquivo `src/config/environment.ts`:

```typescript
import { environment, buildApiUrl } from '../config/environment';

// Construir URL completa
const endpoint = buildApiUrl(environment.endpoints.personAll);
```

## Benefícios

1. **Flexibilidade**: Fácil mudança de URLs entre ambientes
2. **Segurança**: URLs sensíveis não ficam hardcoded no código
3. **Manutenibilidade**: Centralização das configurações
4. **Deploy**: Diferentes configurações para diferentes ambientes 