# Debug - Erro 403 na Atualização de Pessoa

## 🚫 **Problema Identificado:**

**Erro:** `AxiosError: Request failed with status code 403`

**Localização:** `PersonEditModal.tsx:64` - Função `updatePerson`

**Contexto:** Ao tentar atualizar dados de uma pessoa através do modal de edição

## 🔍 **Investigação Realizada:**

### 1. **Teste Direto do Backend:**
```bash
curl -X PATCH 'http://localhost:8080/hex/api/person/10' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Teste Atualização"}' \
  -v
```

**Resultado:** ✅ **SUCESSO (200 OK)**
- Backend está funcionando corretamente
- Endpoint responde adequadamente
- Dados são atualizados no banco

### 2. **Configuração do Frontend:**
- ✅ Proxy configurado corretamente em `vite.config.ts`
- ✅ Headers corretos sendo enviados
- ✅ URL construída adequadamente

### 3. **Possíveis Causas:**

#### **A. Problema com Método HTTP:**
- **Status:** ✅ **Resolvido**
- **Ação:** Mantido `PATCH` (PUT retorna 405 Method Not Allowed)
- **Motivo:** Backend aceita apenas PATCH para atualização

#### **B. Problema com Estrutura de Dados:**
- **Status:** ✅ **Corrigido**
- **Ação:** Inclusão de todos os dados (endereços, contatos, dependentes)
- **Motivo:** Agora enviando dados completos incluindo arrays

#### **C. Problema com CORS/Proxy:**
- **Status:** 🔍 **Investigando**
- **Ação:** Logs adicionais para debug
- **Motivo:** Proxy pode estar interferindo na requisição

## 🛠️ **Correções Implementadas:**

### 1. **Dados Completos para Atualização:**
```typescript
// Incluindo todos os dados da pessoa
const updateData = {
  name: data.name,
  cpf: data.cpf,
  birthDate: data.birthDate,
  nameMother: data.nameMother,
  nameFather: data.nameFather,
  addresses: data.addresses || [],
  contacts: data.contacts || [],
  dependents: data.dependents || []
};
const res = await api.patch(endpoint, updateData);
```

### 2. **Logs de Debug Adicionados:**
```typescript
// Logs específicos para erro 403
if (error.response?.status === 403) {
  console.error('🚫 Erro 403 - Acesso Negado. Verificando configuração do proxy...');
  console.error('🚫 Request URL:', error.config?.url);
  console.error('🚫 Request Method:', error.config?.method);
  console.error('🚫 Request Data:', error.config?.data);
}
```

### 3. **Mantido Método PATCH:**
```typescript
// Mantido PATCH (PUT retorna 405 Method Not Allowed)
const res = await api.patch(endpoint, updateData);
```

## 📊 **Status Atual:**

### ✅ **Correções Aplicadas:**
- [x] Inclusão de todos os dados (endereços, contatos, dependentes)
- [x] Logs de debug adicionados
- [x] Mantido método PATCH (PUT retorna 405)
- [x] Logs adicionais no proxy

### 🔄 **Testando:**
- [ ] Verificar se erro 403 persiste
- [ ] Analisar logs de debug do proxy
- [ ] Testar com diferentes dados
- [ ] Verificar se problema está no proxy

### 📋 **Próximos Passos:**
1. **Testar atualização** no frontend
2. **Analisar logs** no console do navegador
3. **Verificar se erro 403 foi resolvido**
4. **Se persistir, investigar configuração do proxy**

## 🎯 **Resultado Esperado:**

Após as correções implementadas, a atualização de pessoa deve funcionar corretamente:

- ✅ **Sem erro 403**
- ✅ **Dados atualizados no backend**
- ✅ **Feedback visual para o usuário**
- ✅ **Modal fechado após sucesso**

## 🔧 **Comandos para Teste:**

### **Teste do Backend:**
```bash
# Teste PATCH (funciona)
curl -X PATCH 'http://localhost:8080/hex/api/person/10' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Teste PATCH","cpf":"36017308203","birthDate":"1990-01-01"}' \
  -v

# Teste PUT (não funciona - 405 Method Not Allowed)
curl -X PUT 'http://localhost:8080/hex/api/person/10' \
  -H 'Content-Type: application/json' \
  -d '{"name":"Teste PUT","cpf":"36017308203","birthDate":"1990-01-01"}' \
  -v
```

### **Teste do Frontend:**
1. Acessar `http://localhost:5176/`
2. Ir para "Listar Pessoas"
3. Clicar em "Editar" em uma pessoa
4. Modificar dados e salvar
5. Verificar logs no console do navegador

## 📝 **Observações:**

- **Backend funcionando:** ✅ Confirmed
- **Proxy configurado:** ✅ Confirmed
- **CORS configurado:** ✅ Confirmed
- **Problema específico:** 🔍 Investigando

**Status:** 🔄 **Em investigação** 