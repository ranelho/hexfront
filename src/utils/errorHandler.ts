import { ApiErrorResponse, ValidationError, ErrorState } from '../types/error';

export function processApiError(error: any): ErrorState {
  const defaultError: ErrorState = {
    general: 'Erro inesperado. Tente novamente.',
    validations: []
  };

  // Se não há resposta do servidor
  if (!error.response) {
    return {
      general: 'Erro de conexão. Verifique sua internet e tente novamente.',
      validations: []
    };
  }

  const { status, data } = error.response;

  // Se a resposta não tem o formato esperado
  if (!data || typeof data !== 'object') {
    return {
      general: `Erro ${status}: ${error.message || 'Erro desconhecido'}`,
      validations: []
    };
  }

  const apiError = data as ApiErrorResponse;
  const result: ErrorState = {
    general: null,
    validations: []
  };

  // Processar mensagem geral
  if (apiError.message) {
    result.general = apiError.message;
  }

  // Processar validações se existirem
  if (apiError.details && typeof apiError.details === 'object') {
    result.validations = Object.entries(apiError.details).map(([field, message]) => ({
      field,
      message
    }));
  }

  // Mapear códigos de status para mensagens mais amigáveis
  switch (status) {
    case 400:
      if (!result.general) {
        result.general = 'Dados inválidos. Verifique as informações fornecidas.';
      }
      break;
    case 401:
      result.general = 'Acesso não autorizado. Faça login novamente.';
      break;
    case 403:
      result.general = 'Acesso negado. Você não tem permissão para esta ação.';
      break;
    case 404:
      result.general = 'Recurso não encontrado.';
      break;
    case 409:
      result.general = 'Conflito de dados. O registro já existe.';
      break;
    case 422:
      result.general = 'Dados inválidos. Verifique as informações fornecidas.';
      break;
    case 500:
      result.general = 'Erro interno do servidor. Tente novamente mais tarde.';
      break;
    default:
      if (!result.general) {
        result.general = `Erro ${status}: ${apiError.error || 'Erro desconhecido'}`;
      }
  }

  return result;
}

export function getFieldError(field: string, validations: ValidationError[]): string | null {
  const validation = validations.find(v => v.field === field);
  return validation ? validation.message : null;
}

export function hasFieldError(field: string, validations: ValidationError[]): boolean {
  return validations.some(v => v.field === field);
} 