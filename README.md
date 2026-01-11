# IDEX - Versão Corrigida

## 📋 Sobre

Esta é a versão corrigida do sistema IDEX (Sistema de gestão de cursos CSF + Qualificação e Renda) com todas as correções de segurança e sincronização aplicadas.

## 🔒 Correções Aplicadas

### Segurança
- ✅ Removidas senhas em texto plano do Firebase
- ✅ Sistema de autenticação unificado usando hash SHA-256
- ✅ Senhas armazenadas apenas como hash no localStorage
- ✅ Firebase nunca armazena senhas

### Padronização
- ✅ Coleção Firebase padronizada de `'usuarios'` para `'users'`
- ✅ Sistema de autenticação unificado via `authManager`

### Validações
- ✅ Validações de permissões em operações críticas (tarefas, eventos)
- ✅ Controle de acesso adequado (apenas criador/admin pode excluir)

### Performance
- ✅ Limpeza adequada de listeners do Firebase ao fazer logout
- ✅ Prevenção de memory leaks

### Sincronização
- ✅ Sincronização em tempo real via Firebase para todos os dados
- ✅ Fallback para localStorage quando Firebase não está disponível

## 📁 Arquivos

- `index.html` - Arquivo principal com todas as correções aplicadas
- `auth.js` - Sistema de autenticação seguro com hash de senhas
- `firebase.config.js` - Configuração do Firebase
- `firebase.init.js` - Inicialização do Firebase
- `utils.js` - Funções utilitárias (logging, validação, etc.)
- `styles.css` - Estilos do sistema
- `login.js` - Script de login (se aplicável)
- `CHANGELOG.md` - Lista detalhada de todas as mudanças

## 🚀 Como Usar

1. Certifique-se de que o Firebase está configurado corretamente em `firebase.config.js`
2. Abra `index.html` em um servidor web local (não abra diretamente via `file://`)
   - Use um servidor local como: `python -m http.server` ou `npx serve`
3. Faça login com as credenciais padrão:
   - **Admin**: Username: `Csfiac`, Senha: `032147`
   - **Editor**: Username: `Iac`, Senha: `Iac@123`
   - **Visualizador**: Username: `viewer`, Senha: `viewer123`

## ⚠️ Importante

### Migração de Dados

Se você já tinha dados na versão anterior:

1. **Usuários**: Você precisará recriar os usuários, pois as senhas não podem ser migradas (são armazenadas como hash)
2. **Coleção Firebase**: Certifique-se de migrar dados da coleção `'usuarios'` para `'users'` no Firebase Console
3. **Senhas**: Usuários existentes precisarão redefinir suas senhas

### Firestore Collections

As coleções Firebase devem estar assim:
- `users` (não `usuarios`)
- `cursos`
- `tasks`
- `calendarEvents`
- `instrutores`
- `demandantes`
- `notifications`

## 🔧 Configuração

### Firebase

Edite `firebase.config.js` com suas credenciais do Firebase:

```javascript
window.firebaseConfig = {
    apiKey: "sua-api-key",
    authDomain: "seu-auth-domain",
    projectId: "seu-project-id",
    storageBucket: "seu-storage-bucket",
    messagingSenderId: "seu-messaging-sender-id",
    appId: "seu-app-id"
};
```

## 📝 Notas Técnicas

### Autenticação

- Todas as senhas são hasheadas usando SHA-256 antes de serem armazenadas
- O Firebase **NUNCA** armazena senhas, apenas dados básicos do usuário
- A autenticação é feita localmente através do `authManager`
- Dados do usuário são sincronizados com Firebase, mas sem senhas

### Sincronização

- Todos os dados são sincronizados em tempo real via Firebase Firestore
- Quando Firebase não está disponível, o sistema usa localStorage como fallback
- Listeners são configurados automaticamente para todas as coleções principais

### Segurança

- Senhas nunca são enviadas ou armazenadas no Firebase
- Validações de permissão em todas as operações críticas
- Sanitização de dados para prevenir XSS (através de `utils.js`)

## 🐛 Problemas Conhecidos

### Firebase Warning

Se você ver este aviso no console:
```
enableMultiTabIndexedDbPersistence() will be deprecated in the future
```

**Isso é apenas um aviso, não um erro.** A funcionalidade ainda funciona. Este aviso aparece porque o Firebase está informando que o método será depreciado no futuro. Pode ser ignorado com segurança.

## 📞 Suporte

Para questões ou problemas:
1. Verifique o `CHANGELOG.md` para ver todas as mudanças detalhadas
2. Verifique o console do navegador para erros
3. Certifique-se de que o Firebase está configurado corretamente

## ✅ Checklist de Verificação

Antes de usar em produção:

- [ ] Firebase configurado com credenciais corretas
- [ ] Coleção `users` criada no Firestore (não `usuarios`)
- [ ] Permissões do Firestore configuradas corretamente
- [ ] Testado login com usuários padrão
- [ ] Testado criação de novos usuários
- [ ] Testado atribuição de tarefas
- [ ] Testado sincronização entre dispositivos
- [ ] Senhas padrão alteradas para produção

---

**Versão:** Corrigida (2026-01-11)  
**Autor:** Sistema de Correções Automatizadas

