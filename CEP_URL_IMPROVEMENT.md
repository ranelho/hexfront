# CEP URL - Melhoria de Configuração

## 🎯 **Objetivo:**

Substituir a URL hardcoded do CEP por uma variável de ambiente configurável.

## 🚫 **Problema Identificado:**

**Antes:** URL hardcoded no código
```typescript
const response = await fetch(`http://localhost:8080/hex/api/address/zip-code/${cep}`);
```

**Problemas:**
- ❌ URL fixa no código
- ❌ Difícil de alterar entre ambientes
- ❌ Não segue padrões de configuração
- ❌ Dificulta manutenção

## 🛠️ **Melhorias Implementadas:**

### 1. **Configuração de Ambiente:**
```typescript
// src/config/environment.ts
endpoints: {
  // ... outros endpoints
  addressZipCode: import.meta.env.VITE_API_ADDRESS_ZIPCODE_ENDPOINT || '/address/zip-code',
}
```

### 2. **Importação da Função:**
```typescript
// src/components/AddressForm.tsx
import { buildExternalApiUrl } from '../config/environment';
```

### 3. **Uso da URL Configurável:**
```typescript
// Antes
const response = await fetch(`http://localhost:8080/hex/api/address/zip-code/${cep}`);

// Depois
const zipCodeUrl = buildExternalApiUrl(`/address/zip-code/${cep}`);
const response = await fetch(zipCodeUrl);
```

## 📊 **Resultado:**

### **Antes:**
- ❌ URL hardcoded: `http://localhost:8080/hex/api/address/zip-code/${cep}`
- ❌ Difícil manutenção
- ❌ Não configurável

### **Depois:**
- ✅ URL configurável via variável de ambiente
- ✅ Fácil manutenção
- ✅ Segue padrões do projeto
- ✅ Funciona em diferentes ambientes

## 🔧 **Configuração:**

### **Variável de Ambiente:**
```env
VITE_API_ADDRESS_ZIPCODE_ENDPOINT=/address/zip-code
```

### **Fallback:**
Se a variável não estiver definida, usa o valor padrão: `/address/zip-code`

## 🎨 **Benefícios:**

### **Desenvolvimento:**
- **Flexibilidade:** Fácil alteração da URL
- **Padronização:** Segue o mesmo padrão dos outros endpoints
- **Manutenibilidade:** Código mais limpo e organizado

### **Produção:**
- **Configurabilidade:** URL pode ser alterada sem alterar código
- **Ambientes:** Diferentes URLs para diferentes ambientes
- **Segurança:** URLs sensíveis não ficam expostas no código

## 🔍 **Como Verificar:**

1. **Acesse** o formulário de cadastro/edição de pessoa
2. **Digite um CEP** válido (ex: 01001000)
3. **Verifique** que a busca do CEP ainda funciona
4. **Confirme** que não há erros no console

## 📝 **Observações:**

- **Funcionalidade mantida:** A busca de CEP continua funcionando normalmente
- **Compatibilidade:** Mantém compatibilidade com o backend existente
- **Logs:** A função `buildExternalApiUrl` inclui logs para debug
- **Fallback:** Se a variável não estiver definida, usa o valor padrão

## 🔗 **URLs Geradas:**

### **Desenvolvimento:**
```
http://localhost:8080/hex/api/address/zip-code/01001000
```

### **Produção:**
```
https://api.exemplo.com/hex/api/address/zip-code/01001000
```

**Status:** ✅ **Melhoria Implementada com Sucesso** 