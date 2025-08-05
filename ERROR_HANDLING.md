# Sistema de Tratamento de Erros

## Visão Geral

O sistema de tratamento de erros foi implementado para capturar e exibir adequadamente as exceções vindas do backend, incluindo validações de campos e erros gerais.

## Estrutura de Resposta de Erro do Backend

O backend retorna erros no seguinte formato:

```json
{
  "details": {
    "cpf": "Invalid CPF",
    "birthDate": "Invalid birth date",
    "contacts[0].email": "deve ser um endereço de e-mail bem formado"
  },
  "error": "Validation Error",
  "message": "Erros de validação encontrados",
  "timestamp": "2025-07-31T07:52:31.1745415",
  "status": "BAD_REQUEST",
  "code": 400,
  "uuid": "75354469-cef5-4dfe-b95b-228fab85dffd"
}
```

## Componentes Implementados

### 1. Tipos (`src/types/error.ts`)

```typescript
export interface ApiErrorResponse {
  details: Record<string, string> | null;
  error: string;
  message: string;
  timestamp: string;
  status: string;
  code: number;
  uuid: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorState {
  general: string | null;
  validations: ValidationError[];
}
```

### 2. Utilitário de Tratamento (`src/utils/errorHandler.ts`)

Funções principais:
- `processApiError(error)`: Processa erros da API e retorna um `ErrorState`
- `getFieldError(field, validations)`: Obtém erro específico de um campo
- `hasFieldError(field, validations)`: Verifica se um campo tem erro

### 3. Componentes Atualizados

- **PersonFormModal**: Tratamento de erros no cadastro
- **PersonEditModal**: Tratamento de erros na edição

## Funcionalidades

### 1. Erro Geral
- Exibido no topo do formulário
- Mensagem amigável baseada no código de status
- Estilo visual destacado

### 2. Validações de Campo
- Erros específicos por campo
- Input com borda vermelha quando há erro
- Mensagem de erro abaixo do campo

### 3. Códigos de Status Mapeados

| Status | Mensagem |
|--------|----------|
| 400 | Dados inválidos. Verifique as informações fornecidas. |
| 401 | Acesso não autorizado. Faça login novamente. |
| 403 | Acesso negado. Você não tem permissão para esta ação. |
| 404 | Recurso não encontrado. |
| 409 | Conflito de dados. O registro já existe. |
| 422 | Dados inválidos. Verifique as informações fornecidas. |
| 500 | Erro interno do servidor. Tente novamente mais tarde. |

## Uso nos Componentes

```typescript
import { processApiError, getFieldError, hasFieldError } from '../utils/errorHandler';
import type { ErrorState } from '../types/error';

// Estado
const [errorState, setErrorState] = useState<ErrorState>({ 
  general: null, 
  validations: [] 
});

// Tratamento de erro
try {
  await createPerson(person);
  onSuccess();
} catch (err) {
  const processedError = processApiError(err);
  setErrorState(processedError);
}

// Exibição de erro geral
{errorState.general && (
  <div className="status-message status-error">
    {errorState.general}
  </div>
)}

// Exibição de erro de campo
<input 
  className={`form-input ${hasFieldError('name', errorState.validations) ? 'error' : ''}`}
/>
{getFieldError('name', errorState.validations) && (
  <div className="error-message">{getFieldError('name', errorState.validations)}</div>
)}
```

## Estilos CSS

```css
.details-item .form-input.error {
  border-color: #e74c3c;
  background-color: #fdf2f2;
}

.details-item .form-input.error:focus {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}
```

## Benefícios

1. **Experiência do Usuário**: Mensagens claras e específicas
2. **Manutenibilidade**: Código centralizado e reutilizável
3. **Consistência**: Tratamento uniforme em todos os componentes
4. **Debugging**: Logs detalhados para desenvolvimento
5. **Flexibilidade**: Fácil extensão para novos tipos de erro 