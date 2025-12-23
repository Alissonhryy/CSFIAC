# CSF + Qualificação e Renda

Sistema de gestão de cursos e capacitações profissionais.

## 📁 Estrutura do Projeto

```
/
├── index.html          # Página principal
├── assets/
│   ├── css/
│   │   ├── base.css        # Variáveis CSS e reset
│   │   ├── themes.css      # Temas de cores
│   │   ├── animations.css  # Animações e sistema de níveis
│   │   ├── components.css  # Componentes (cards, botões, etc)
│   │   ├── layout.css      # Layout (sidebar, header, etc)
│   │   └── login.css       # Estilos da tela de login
│   └── js/
│       ├── auth.js         # Autenticação
│       ├── dashboard.js    # Dashboard e KPIs
│       ├── charts.js       # Gráficos
│       ├── search.js       # Busca global
│       └── ui.js           # Componentes de UI
└── README.md
```

## 🎨 Temas

O sistema possui 5 temas principais:

- **Green** - Verde
- **Purple** - Roxo
- **Blue** - Azul
- **Orange** - Laranja
- **Pink** - Rosa

Cada tema possui variantes:
- **Dark Mode** (padrão)
- **Light Mode**

### Como alterar o tema

```javascript
// Via JavaScript
document.documentElement.classList.remove('theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-pink');
document.documentElement.classList.add('theme-green');
```

## 🎭 Sistema de Níveis de Animação

O sistema possui 3 níveis de animação para otimizar performance:

### Nível 0: Sem animações
```css
:root {
    --motion-level: 0;
}
```
- Desabilita todas as animações
- Ideal para dispositivos muito fracos

### Nível 1: Normal (padrão)
```css
:root {
    --motion-level: 1;
}
```
- Apenas animações essenciais (fade-in, skeleton, loading)
- Animações infinitas desabilitadas
- Ideal para a maioria dos dispositivos

### Nível 2: Completo
```css
:root {
    --motion-level: 2;
}
```
- Todas as animações habilitadas
- Ideal para desktops potentes

### Como alterar o nível

**Via Interface:**
1. Acesse **Configurações** → **Aparência**
2. Encontre a seção **"Nível de Animações"**
3. Selecione o nível desejado

**Via JavaScript:**
```javascript
// Usar a função global
setMotionLevel(1); // 0, 1 ou 2

// Ou diretamente
document.documentElement.style.setProperty('--motion-level', '1');
```

**A preferência é salva automaticamente** no localStorage e aplicada em todas as sessões.

## 📐 Padrões de Design

### Border-radius
- **Cards**: `16px` (`--radius-card`)
- **Botões**: `12px` (`--radius-button`)
- **Inputs**: `10px` (`--radius-input`)
- **Elementos pequenos**: `8px` (`--radius-small`)

### Hierarquia Visual
1. **KPIs** - Maior destaque
2. **Conteúdo** - Tamanho médio
3. **Ações secundárias** - Menor destaque

## 🚀 Performance

### Otimizações Implementadas

1. **Animações condicionais** - Baseadas em `--motion-level`
2. **Partículas desabilitadas por padrão** - Habilitadas apenas em desktop
3. **Box-shadows reduzidas em mobile**
4. **Backdrop-filter desabilitado em mobile**
5. **Animações infinitas limitadas**

### Mobile
- Animações reduzidas automaticamente
- Box-shadows simplificadas
- Efeitos pesados desabilitados

### Desktop
- Partículas habilitadas (se motion-level >= 2)
- Todas as animações disponíveis

## 🔒 Segurança

### ⚠️ Limitações Conhecidas

Este é um **protótipo** com autenticação client-side. Para produção:

1. **Autenticação no backend**
   - Nunca validar senha apenas no JavaScript
   - Usar JWT ou sessões server-side

2. **Validação server-side**
   - Todos os dados devem ser validados no servidor
   - Upload de Excel deve ser validado server-side

3. **HTTPS obrigatório**
   - Nunca usar em produção sem HTTPS

4. **Sanitização de dados**
   - Todos os inputs devem ser sanitizados
   - Prevenir XSS e SQL Injection

## 📱 Modo Offline (PWA)

O sistema possui suporte básico a PWA:

- **Manifest.json** configurado
- **Service Worker** (se implementado)
- **Cache de assets**

### Melhorias Futuras
- Cache de dados com IndexedDB
- Sincronização quando voltar online
- Aviso "Você está offline"

## 🛠️ Desenvolvimento

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado

### Dependências Externas
- Chart.js (gráficos)
- SheetJS (leitura de Excel)
- html2canvas (captura de tela)
- JSZip (download de múltiplos arquivos)
- Firebase (opcional, para storage)

## 📝 Notas de Manutenção

### CSS
- Variáveis CSS centralizadas em `base.css`
- Temas em `themes.css`
- Animações em `animations.css`

### JavaScript
- Código modularizado por funcionalidade
- Funções principais documentadas

### Estrutura HTML
- Semântica HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- ARIA labels para acessibilidade

## 🐛 Limitações Conhecidas

1. **Autenticação client-side** - Não seguro para produção
2. **Armazenamento local** - Dados podem ser perdidos
3. **Sem backend** - Funcionalidades limitadas
4. **Performance em dispositivos fracos** - Pode ser lento

## 📄 Licença

Sistema desenvolvido para Ceará Sem Fome + Qualificação e Renda.

## 👥 Contribuição

Para melhorias e sugestões, documentar no código e manter este README atualizado.

