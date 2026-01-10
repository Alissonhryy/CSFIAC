# CSF + Qualificação e Renda

Sistema de gestão de cursos e qualificação profissional desenvolvido para o programa Ceará Sem Fome.

## 📋 Estrutura do Projeto

```
CSF/
├── Config/
│   └── firebase.config.js      # Configuração do Firebase
├── css/
│   └── styles.css              # Estilos principais (design system)
├── js/
│   ├── auth.js                 # Sistema de autenticação seguro
│   ├── login.js                # Módulo de login e autenticação
│   ├── utils.js                # Funções utilitárias
│   ├── password-validator.js   # Validação robusta de senhas
│   └── firebase.init.js        # Inicialização do Firebase
├── index.html                  # Página principal
└── README.md                   # Este arquivo
```

## 🔐 Segurança

### Autenticação
- **Hash de Senhas**: Utiliza SHA-256 via Web Crypto API
- **Validação de Senha Forte**: Requisitos mínimos:
  - Mínimo 8 caracteres
  - Pelo menos 1 letra maiúscula
  - Pelo menos 1 letra minúscula
  - Pelo menos 1 número
  - Pelo menos 1 caractere especial
  - Bloqueio de senhas comuns
  - Bloqueio de sequências e padrões do teclado

### Proteção contra Ataques
- **XSS**: Sanitização de inputs (escapeHtml, escapeHtmlAttribute)
- **Brute Force**: Bloqueio temporário após 5 tentativas falhas (30 segundos)
- **Senhas Padrão**: Força alteração de senhas padrão no primeiro login

### Logs e Monitoramento
- Logs condicionais (apenas em desenvolvimento)
- Armazenamento de erros críticos no localStorage
- Sistema de auditoria para ações importantes

## 🚀 Funcionalidades

### Principais
- ✅ Gestão de Cursos
- ✅ Gestão de Instrutores
- ✅ Calendário de Eventos
- ✅ Sistema de Tarefas
- ✅ Dashboard com Métricas
- ✅ Importação/Exportação de Dados (Excel)
- ✅ Sistema de Backup e Restore
- ✅ PWA (Progressive Web App)

### Segurança e Acesso
- ✅ Sistema de permissões (Admin, Editor, Viewer)
- ✅ Logs de auditoria
- ✅ Histórico de atividades
- ✅ Sessão persistente com "Lembrar-me"

## 📦 Instalação

1. Clone ou baixe o repositório
2. Configure o Firebase no arquivo `Config/firebase.config.js`
3. Abra `index.html` em um servidor web local ou hospede em um servidor

### Requisitos
- Navegador moderno com suporte a:
  - ES6+
  - Web Crypto API
  - LocalStorage
  - Service Workers (para PWA)

### CDNs Utilizadas
- Firebase SDK 9.22.0
- Chart.js (gráficos)
- SheetJS (leitura de Excel)
- html2canvas (captura de tela)
- JSZip (download de múltiplos arquivos)

## 🔧 Configuração

### Firebase
Configure as credenciais do Firebase em `Config/firebase.config.js`:
```javascript
const firebaseConfig = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    // ... outras configurações
};
```

**IMPORTANTE**: Configure regras de segurança restritivas no Firestore e Storage.

### Usuários Padrão
O sistema cria automaticamente 3 usuários padrão no primeiro uso:
- **Admin**: `Csfiac` / `032147`
- **Editor**: `Iac` / `Iac@123`
- **Viewer**: `viewer` / `viewer123`

⚠️ **ALERTA DE SEGURANÇA**: Todos os usuários padrão serão forçados a alterar a senha no primeiro login.

## 🎨 Design System

O sistema utiliza variáveis CSS customizadas para fácil customização:

### Cores Principais
- `--primary`: #6366f1 (Índigo)
- `--success`: #10b981 (Verde)
- `--warning`: #f59e0b (Amarelo)
- `--danger`: #ef4444 (Vermelho)
- `--info`: #3b82f6 (Azul)

### Temas
- **Dark Mode** (padrão)
- **Light Mode**
- **Alto Contraste**

### Espaçamentos
- `--spacing-xs` a `--spacing-2xl` (4px a 48px)

## 📝 Desenvolvimento

### Estrutura de Módulos
O código está organizado em módulos separados:
- **auth.js**: Gerencia autenticação e usuários
- **login.js**: Interface e lógica de login
- **utils.js**: Funções utilitárias gerais
- **password-validator.js**: Validação de senhas

### Melhores Práticas Implementadas
- ✅ Separação de responsabilidades
- ✅ Funções documentadas com JSDoc
- ✅ Validação de inputs
- ✅ Tratamento de erros
- ✅ Logging seguro (apenas em desenvolvimento)
- ✅ Código reutilizável

## 🔒 Recomendações de Segurança

1. **Alterar Senhas Padrão**: Todos os usuários padrão devem alterar suas senhas imediatamente
2. **Configurar Regras do Firestore**: Implemente regras restritivas no Firebase
3. **HTTPS**: Sempre use HTTPS em produção
4. **Atualizar Dependências**: Mantenha as bibliotecas atualizadas
5. **Backup Regular**: Use o sistema de backup integrado

## 🐛 Troubleshooting

### Erro ao carregar Firebase
- Verifique se `firebase.config.js` está carregado antes de `firebase.init.js`
- Confirme que as credenciais do Firebase estão corretas

### Problemas de Autenticação
- Limpe o localStorage: `localStorage.clear()`
- Verifique se o navegador suporta Web Crypto API

### Erros de CORS
- Certifique-se de que está servindo via HTTP/HTTPS (não file://)
- Configure CORS no Firebase se necessário

## 📄 Licença

Este projeto é de uso interno do programa Ceará Sem Fome.

## 👥 Suporte

Para suporte ou dúvidas, entre em contato com a equipe de desenvolvimento.

---

**Última atualização**: 2024
**Versão**: 2.0 (com melhorias de segurança e estrutura)

