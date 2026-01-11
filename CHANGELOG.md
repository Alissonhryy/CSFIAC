# Changelog - Correções Aplicadas

## Data: 11/01/2026

### 🔒 Segurança

1. **Remoção de senhas em texto plano do Firebase**
   - Todas as senhas agora são armazenadas apenas como hash no localStorage através do `authManager`
   - Firebase nunca armazena senhas, apenas dados básicos do usuário (nome, username, role, email)
   - Correções aplicadas em:
     - `handleUserSubmit` - criação e edição de usuários
     - `createTask` - não armazena senhas
     - `updateTask` - não armazena senhas

2. **Sistema de autenticação unificado**
   - Removido sistema de login duplicado que usava senha em texto plano
   - Toda autenticação agora passa pelo `authManager` que usa hash SHA-256
   - Correções aplicadas em:
     - `handleLogin` - agora usa apenas `authManager.authenticate()`
     - `handleChangePassword` - usa `authManager.changePassword()` que verifica hash

### 📦 Padronização de Coleções Firebase

1. **Unificação da coleção de usuários**
   - Todas as referências de `'usuarios'` foram substituídas por `'users'`
   - Correções aplicadas em:
     - `initializeUsers` - usa coleção `'users'`
     - `handleUserSubmit` - usa coleção `'users'`
     - `setupUsersListener` - ouve coleção `'users'`
     - `loadUsersForTaskAssignment` - busca na coleção `'users'`
     - `syncUsersToFirebase` - sincroniza para coleção `'users'`
     - `handleChangeName` - atualiza na coleção `'users'`
     - `deleteUser` - deleta da coleção `'users'`
     - `savePermissions` - atualiza na coleção `'users'`

### 🔐 Validações de Permissões

1. **Controle de acesso para tarefas**
   - Adicionadas validações em `updateTask`:
     - Apenas o criador, o usuário atribuído ou admin podem editar
   - Adicionadas validações em `deleteTask`:
     - Apenas o criador ou admin podem excluir

2. **Validações de permissões para eventos do calendário**
   - `deleteCalendarEvent` já validava: apenas admin ou criador pode excluir
   - Mantido funcionamento existente

### 🧹 Limpeza de Listeners

1. **Função de limpeza de listeners do Firebase**
   - Adicionada função `cleanupFirebaseListeners()` para limpar todos os listeners ao fazer logout
   - Previne memory leaks quando usuário faz logout
   - Listeners limpos:
     - `calendarEventsListener`
     - `coursesListener`
     - `tasksListener`
     - `instructorsListener`
     - `demandantesListener`
     - `usersListener`

2. **Integração no logout**
   - `handleLogout` agora chama `cleanupFirebaseListeners()` antes de limpar sessão

### 🛠️ Funções Auxiliares de Segurança

1. **Adicionadas funções auxiliares**
   - `safeJsonParse()` - parse seguro de JSON com tratamento de erros
   - `hasPermission()` - validação centralizada de permissões
   - `cleanupFirebaseListeners()` - limpeza de listeners

### 🐛 Correções de Bugs

1. **Sistema de menções de tarefas**
   - Corrigido carregamento de usuários no dropdown de atribuição
   - `loadUsersForTaskAssignment` agora prioriza Firebase, depois localStorage
   - Adicionado indicador de carregamento
   - Adicionada lógica de retry caso `authManager` não esteja disponível

2. **Sincronização de dados**
   - Todos os dados agora são sincronizados em tempo real via Firebase
   - Listeners configurados para todas as coleções principais
   - Fallback para localStorage quando Firebase não está disponível

3. **Tratamento de erros melhorado**
   - Substituído `JSON.parse` direto por `safeJsonParse` em locais críticos
   - Melhor tratamento de erros em operações Firebase
   - Mensagens de erro mais informativas

### 📝 Melhorias de Código

1. **Organização e modularização**
   - Firebase configurado em módulos separados (`firebase.config.js`, `firebase.init.js`)
   - Autenticação separada em `auth.js`
   - Utilitários separados em `utils.js`
   - Ordem de carregamento dos scripts corrigida no `index.html`

2. **Comentários e documentação**
   - Adicionados comentários explicativos em funções críticas
   - Documentação sobre warning do Firebase `enableMultiTabIndexedDbPersistence()`
   - Comentários sobre decisões de segurança (não salvar senhas no Firebase)

### ⚠️ Observações Importantes

1. **Firebase Warning sobre `enableMultiTabIndexedDbPersistence()`**
   - Este é apenas um aviso de depreciação, não um erro
   - A funcionalidade ainda funciona perfeitamente
   - O warning pode ser ignorado
   - Quando migrar para a versão modular do Firebase, poderá usar a nova API `FirestoreSettings.cache`

2. **Migração de Dados**
   - Usuários existentes no Firebase com senhas em texto plano precisarão ter suas senhas redefinidas
   - Recomenda-se criar novos usuários através do sistema corrigido
   - Dados antigos na coleção `'usuarios'` precisam ser migrados para `'users'`

### 📋 Arquivos Modificados

- `index.html` - Correções principais de segurança, validações e sincronização
- `auth.js` - Já estava correto, mas verificado
- `firebase.init.js` - Já estava correto, mas verificado
- `utils.js` - Já estava correto, mas verificado

### ✅ Status

Todas as correções críticas foram aplicadas. O sistema está mais seguro e padronizado.

