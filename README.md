# Sistema de Gestão de Pessoas

Frontend React + TypeScript + Vite para o sistema de gestão de pessoas.

## 🚀 Tecnologias

- **React 19** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Axios** - Cliente HTTP
- **React Router** - Roteamento
- **React Icons** - Ícones

## 📋 Funcionalidades

- ✅ Listagem de pessoas com paginação
- ✅ Filtros por nome e CPF
- ✅ Cadastro de pessoas
- ✅ Edição de pessoas
- ✅ Visualização detalhada
- ✅ Exclusão com confirmação
- ✅ Validação de CPF duplicado
- ✅ Gestão de endereços, contatos e dependentes
- ✅ Formatação de dados (CPF, telefone, data)

## 🛠️ Configuração do Ambiente

### 1. Instalação de Dependências

```bash
npm install
```

### 2. Configuração de Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configurar as URLs dos endpoints da API.

#### Opção 1: Script Automático (Recomendado)

```bash
# Para desenvolvimento (padrão)
npm run setup:env

# Para staging
npm run setup:env:staging

# Para produção
npm run setup:env:prod
```

#### Opção 2: Configuração Manual

Crie um arquivo `.env` na raiz do projeto:

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

### 3. Execução

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── PersonFormModal.tsx
│   ├── PersonEditModal.tsx
│   ├── AddressForm.tsx
│   ├── ContactForm.tsx
│   └── DependentForm.tsx
├── config/             # Configurações
│   ├── environment.ts
│   └── environments.ts
├── pages/              # Páginas da aplicação
│   └── PersonListPage.tsx
├── services/           # Serviços de API
│   ├── personService.ts
│   ├── addressService.ts
│   └── dependentService.ts
├── styles/             # Estilos CSS
│   └── personList.css
└── types/              # Tipos TypeScript
    └── person.ts
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa o linter
- `npm run setup:env` - Configura variáveis de ambiente
- `npm run setup:env:dev` - Configura ambiente de desenvolvimento
- `npm run setup:env:staging` - Configura ambiente de staging
- `npm run setup:env:prod` - Configura ambiente de produção

## 🌍 Ambientes

### Desenvolvimento
- URL: `http://localhost:8080`
- Proxy ativo para evitar CORS
- Logs detalhados

### Staging
- URL: `https://staging-api.seudominio.com`
- Sem proxy
- Configurações de teste

### Produção
- URL: `https://api.seudominio.com`
- Sem proxy
- Configurações otimizadas

## 📚 Documentação Adicional

- [Configuração de Ambiente](ENVIRONMENT.md) - Detalhes sobre variáveis de ambiente
- [Estrutura de Dados](src/types/person.ts) - Interfaces TypeScript

## 🔒 Segurança

- Variáveis de ambiente para URLs sensíveis
- Validação de CPF duplicado
- Confirmação para exclusões
- Sanitização de dados

## 🎨 Design

- Interface moderna com glassmorphism
- Responsivo para mobile e desktop
- Animações suaves
- Estados de loading e erro
- Modais customizados
