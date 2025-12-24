# CSF + Qualificação e Renda - Sistema Refatorado

Sistema de gestão de cursos refatorado com arquitetura modular, melhorias de segurança e performance.

## 🚀 Estrutura do Projeto

```
CSF/
├── src/
│   ├── config/          # Configurações (Firebase, App)
│   ├── js/
│   │   ├── firebase/    # Módulos Firebase
│   │   ├── modules/     # Módulos de negócio (courses, instructors, etc)
│   │   ├── state/       # Gerenciamento de estado
│   │   └── utils/       # Utilitários (security, format, logger)
│   └── css/            # Estilos (a ser extraído)
├── dist/               # Build de produção
├── tests/              # Testes
├── index.html          # HTML principal (refatorado)
├── package.json
├── vite.config.js
└── .env.example
```

## 📦 Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Editar .env com suas credenciais do Firebase
```

3. **Desenvolvimento:**
```bash
npm run dev
```

4. **Build para produção:**
```bash
npm run build
```

## 🔒 Segurança

### Variáveis de Ambiente

**IMPORTANTE:** As credenciais do Firebase agora estão em variáveis de ambiente. Nunca commite o arquivo `.env` no controle de versão.

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### Senhas

As senhas dos usuários padrão ainda estão hardcoded no código. **Recomendação:** Implementar hash de senhas (bcrypt) e autenticação Firebase adequada.

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com UI
npm run test:ui

# Cobertura de testes
npm run test:coverage
```

## 📝 Próximos Passos

### 1. Extrair CSS Completo

O CSS ainda precisa ser extraído do arquivo original `index.html`. Você pode:

- Usar um script automatizado
- Copiar manualmente a seção `<style>` para `src/css/styles.css`
- Usar ferramentas de extração

### 2. Modularizar JavaScript

Muitas funções ainda estão no arquivo original. Mover para módulos apropriados:

- `src/js/modules/courses.js` - Gestão de cursos
- `src/js/modules/instructors.js` - Gestão de instrutores
- `src/js/modules/users.js` - Gestão de usuários
- `src/js/modules/dashboard.js` - Dashboard e KPIs
- `src/js/modules/calendar.js` - Calendário

### 3. Implementar Lazy Loading

Os módulos já estão configurados para lazy loading no `vite.config.js`. Certifique-se de usar imports dinâmicos:

```javascript
const module = await import('./modules/courses.js');
```

### 4. Melhorar Segurança

- [ ] Implementar hash de senhas
- [ ] Adicionar autenticação Firebase adequada
- [ ] Validar todas as entradas do usuário
- [ ] Implementar rate limiting

### 5. Performance

- [ ] Implementar code splitting completo
- [ ] Otimizar imagens
- [ ] Implementar service worker para cache
- [ ] Lazy load de componentes pesados

## 🛠️ Tecnologias

- **Vite** - Build tool e dev server
- **Firebase** - Backend (Firestore + Storage)
- **Chart.js** - Gráficos
- **SheetJS** - Importação/Exportação Excel
- **Vitest** - Framework de testes

## 📄 Licença

MIT

