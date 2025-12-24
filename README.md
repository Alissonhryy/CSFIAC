# CSF - Sistema de Gestão de Cursos

## 📁 Estrutura de Arquivos

```
CSF/
├── css/
│   ├── design-system.css    # Sistema de design (cores, espaçamentos, variáveis)
│   ├── components.css       # Componentes reutilizáveis (cards, botões, KPIs)
│   └── themes.css           # Temas de cores e fontes
├── js/
│   ├── core/
│   │   ├── state.js         # Gerenciador de estado e StorageRepository
│   │   └── config.js        # Logger e tratamento de erros
│   ├── dashboard.js         # Dashboard, KPIs e gráficos
│   ├── ux.js                # Onboarding, busca global, modais
│   ├── accessibility.js     # Acessibilidade (aria-labels, navegação)
│   ├── performance.js       # Otimizações (debounce, compressão)
│   └── main.js              # Inicialização principal
└── index.html
```

## 🚀 Funcionalidades Implementadas

### Design System
- ✅ Sistema de cores com melhor contraste
- ✅ Espaçamentos consistentes (sistema 8px)
- ✅ Componentes reutilizáveis (cards, botões, KPIs)
- ✅ Suporte a temas (claro, escuro, alto contraste)

### Gerenciamento de Estado
- ✅ `AppState` - Estado centralizado da aplicação
- ✅ `StorageRepository` - Armazenamento com fallback para memória
- ✅ Tratamento de erros de quota do localStorage

### Dashboard
- ✅ KPIs clicáveis que filtram cursos
- ✅ Empty state com onboarding
- ✅ CTAs claros (Cadastrar, Ver Todos, Relatório)
- ✅ Lazy load de gráficos (só carrega quando visível)

### UX/Experiência
- ✅ Onboarding automático para novos usuários
- ✅ Busca global com atalho Ctrl+K
- ✅ Modais de confirmação para ações perigosas
- ✅ Barra de progresso para importações

### Acessibilidade
- ✅ aria-labels automáticos em botões
- ✅ Navegação por teclado completa
- ✅ Foco visível em todos os elementos
- ✅ Skip link para conteúdo principal
- ✅ Anúncios para leitores de tela

### Performance
- ✅ Debounce e throttle para eventos
- ✅ Compressão de imagens antes de salvar
- ✅ Lazy load com Intersection Observer
- ✅ Memoização para cálculos pesados

## 📝 Como Usar

### CSS
Os arquivos CSS já estão importados no `index.html`:
```html
<link rel="stylesheet" href="css/design-system.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/themes.css">
```

### JavaScript
O JavaScript modular já está importado:
```html
<script type="module" src="js/main.js"></script>
```

### Variáveis Globais
Os módulos exportam funções para `window` para compatibilidade:
- `window.AppState` - Estado da aplicação
- `window.StorageRepository` - Repositório de armazenamento
- `window.Logger` - Logger condicional
- `window.renderDashboard()` - Renderizar dashboard
- `window.showOnboarding()` - Mostrar onboarding
- `window.openGlobalSearch()` - Abrir busca global
- `window.confirmAction()` - Modal de confirmação
- `window.showProgress()` - Barra de progresso

## 🔧 Próximos Passos

1. **Migração Gradual**: Migrar funções do JavaScript inline para os módulos
2. **Remover onclick**: Substituir todos os `onclick=""` por `addEventListener`
3. **Testes**: Testar todas as funcionalidades após a migração
4. **Otimizações**: Aplicar lazy load em mais componentes

## 📚 Documentação dos Módulos

### `/js/core/state.js`
Gerencia o estado global da aplicação e o armazenamento.

**AppState**: Estado centralizado
- `courses`, `instructors`, `users`, `tasks`, etc.
- Métodos `setCourses()`, `setInstructors()`, etc.
- `saveToLocalStorage()` e `loadFromLocalStorage()`

**StorageRepository**: Repositório de armazenamento
- `getItem(key, defaultValue)`
- `setItem(key, value)`
- `removeItem(key)`
- Fallback automático para memória se localStorage falhar

### `/js/core/config.js`
Configurações e utilitários.

**Logger**: Logging condicional
- `Logger.log()` - Só loga em desenvolvimento
- `Logger.warn()` - Só loga em desenvolvimento
- `Logger.error()` - Sempre loga

**handleError()**: Tratamento centralizado de erros
- Mostra mensagem ao usuário
- Salva log de erros
- Envia para serviço de monitoramento (se configurado)

### `/js/dashboard.js`
Dashboard e visualizações.

**renderDashboard()**: Renderiza o dashboard completo
**updateKPIs()**: Atualiza os KPIs e os torna clicáveis
**renderEmptyState()**: Mostra estado vazio com onboarding
**renderRecentCourses()**: Renderiza cursos recentes
**renderDashboardCTAs()**: Adiciona CTAs no header

### `/js/ux.js`
Experiência do usuário.

**showOnboarding()**: Modal de boas-vindas
**confirmAction()**: Modal de confirmação
**showProgress()**: Barra de progresso
**openGlobalSearch()**: Busca global (Ctrl+K)

### `/js/accessibility.js`
Acessibilidade.

**initAccessibility()**: Inicializa todas as melhorias de acessibilidade
- Adiciona aria-labels
- Configura navegação por teclado
- Adiciona skip link
- Configura anúncios para leitores de tela

### `/js/performance.js`
Otimizações de performance.

**debounce()**: Debounce para eventos
**throttle()**: Throttle para scroll/resize
**compressImage()**: Compacta imagens antes de salvar
**memoize()**: Memoização para funções pesadas
**observeElement()**: Intersection Observer wrapper

## 🎨 Design System

### Cores
- `--primary`: #6366f1
- `--success`: #10b981
- `--warning`: #f59e0b
- `--danger`: #ef4444
- `--info`: #3b82f6

### Espaçamentos (Sistema 8px)
- `--space-xs`: 4px
- `--space-sm`: 8px
- `--space-md`: 16px
- `--space-lg`: 24px
- `--space-xl`: 32px
- `--space-2xl`: 48px
- `--space-3xl`: 64px

### Componentes
- `.card` - Card básico
- `.btn` - Botão (primary, secondary, ghost)
- `.kpi-card` - Card de KPI
- `.empty-state` - Estado vazio
- `.progress-bar-container` - Barra de progresso

## 🔐 Segurança

- Sanitização de HTML (XSS prevention)
- Validação de dados
- Logs de auditoria
- Tratamento de erros

## 📱 PWA

O sistema suporta PWA com:
- Service Worker
- Manifest.json
- Instalação offline
- Cache de recursos

## 🌐 Compatibilidade

- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile: ✅

## 📄 Licença

Este projeto é de uso interno.

