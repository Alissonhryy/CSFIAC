# Changelog - Correções Realizadas

## 🔧 Correções Críticas

### auth.js
- **ANTES**: `this.users = this.loadUsers()` no construtor causava Promise em vez de array
- **DEPOIS**: Método `init()` assíncrono separado, `this.users = []` no construtor
- **IMPACTO**: Primeiro login agora funciona corretamente

### auth.js - Hash de Senhas
- **ANTES**: SHA-256 sem salt (vulnerável a rainbow tables)
- **DEPOIS**: PBKDF2 com salt único (100.000 iterações)
- **IMPACTO**: Senhas agora são muito mais seguras

### utils.js - Validação CPF
- **ANTES**: `count - 12` (sempre negativo, validação quebrada)
- **DEPOIS**: `count - 2` (correto)
- **IMPACTO**: Validação de CPF agora funciona

### login.js - Verificações
- **ANTES**: `authManager.isUserBlocked()` sem verificar se existe
- **DEPOIS**: Verificação `typeof authManager !== 'undefined'` antes de usar
- **IMPACTO**: Não quebra mais se auth.js não carregar

### login.js - Memory Leak
- **ANTES**: `blockInterval` criado a cada chamada, nunca limpo
- **DEPOIS**: Referência global `blockIntervalRef`, limpo antes de criar novo
- **IMPACTO**: Sem memory leaks, performance melhorada

### firebase.init.js - safeError
- **ANTES**: `safeError()` chamado sem verificação em catch
- **DEPOIS**: Função helper `logError()` que verifica se existe
- **IMPACTO**: Não quebra mais se utils.js não carregar

## 📦 Novos Arquivos

- `README.md`: Documentação completa
- `INIT.js`: Script de inicialização
- `CHANGELOG.md`: Este arquivo

## ⚠️ Breaking Changes

### AuthManager
- Agora requer chamar `authManager.init()` antes de usar
- Senhas antigas (SHA-256) ainda funcionam, mas serão migradas ao alterar senha

## 🔄 Migração

### Para código existente usando authManager:

**ANTES:**
```javascript
const user = await authManager.authenticate(username, password);
```

**DEPOIS:**
```javascript
// Garantir inicialização
if (!authManager.initialized && authManager.init) {
    await authManager.init();
}
const user = await authManager.authenticate(username, password);
```

Ou usar o `INIT.js` que faz isso automaticamente.

## 📝 Notas de Segurança

1. Senhas padrão ainda estão no código (remover comentários em produção)
2. Credenciais Firebase hardcoded (adicionar proteções em produção)
3. Hash PBKDF2 implementado (seguro para produção)

