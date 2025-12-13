# 🎓 Sistema de Gestão de Cursos e Instrutores

Sistema moderno e responsivo para gestão de cursos, instrutores e alunos, desenvolvido com React, TypeScript e Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-purple)

## ✨ Características

- 🎨 **Interface Moderna**: Design "Neo-Academic Modern" com glassmorphism e animações suaves
- 📱 **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 🔍 **Busca e Filtros Avançados**: Filtre cursos por status, categoria e busque por nome/instrutor
- 📊 **Dashboard Interativo**: Gráficos e estatísticas em tempo real
- 🎯 **Gestão Completa**: Crie e gerencie cursos e instrutores facilmente
- 🌙 **Suporte a Dark Mode**: Tema claro e escuro
- ⚡ **Performance Otimizada**: Construído com Vite para carregamento rápido

## 🚀 Tecnologias

- **React 19.2** - Biblioteca UI
- **TypeScript 5.6** - Tipagem estática
- **Vite 7.1** - Build tool e dev server
- **Tailwind CSS 4.1** - Estilização
- **Wouter** - Roteamento leve
- **Chart.js** - Gráficos e visualizações
- **Radix UI** - Componentes acessíveis
- **Sonner** - Notificações toast
- **Lucide React** - Ícones modernos

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- pnpm (recomendado) ou npm/yarn

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/sistema-cursos-melhorado.git
cd sistema-cursos-melhorado
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
```

4. **Acesse no navegador**
```
http://localhost:3000
```

## 📖 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento

# Build
pnpm build        # Cria build de produção
pnpm preview      # Preview do build de produção

# Qualidade
pnpm check        # Verifica erros TypeScript
pnpm format       # Formata código com Prettier
```

## 🎯 Funcionalidades

### 📚 Página de Cursos
- ✅ Listagem de todos os cursos
- ✅ Busca por nome ou instrutor
- ✅ Filtros por status (Em Andamento, Concluído, Pendente)
- ✅ Filtros por categoria
- ✅ Criação de novos cursos via modal
- ✅ Visualização de estatísticas (alunos, duração, data de início)
- ✅ Ações rápidas (editar, gerenciar alunos, arquivar)

### 👥 Página de Instrutores
- ✅ Cards visuais com informações dos instrutores
- ✅ Busca por nome ou especialidade
- ✅ Filtro por status (Ativo, Inativo, Licença)
- ✅ Criação de novos instrutores via modal
- ✅ Estatísticas (cursos, alunos, avaliação)
- ✅ Ações rápidas (email, chat, ver perfil)

### 📊 Dashboard
- ✅ Cards de estatísticas principais
- ✅ Gráfico de crescimento de matrículas (linha)
- ✅ Gráfico de distribuição de status (rosca)
- ✅ Tabela de cursos recentes com progresso
- ✅ Indicadores de tendência (↑↓)

### 🎨 Interface
- ✅ Animações suaves e transições
- ✅ Estados vazios informativos
- ✅ Feedback visual (toasts de sucesso/erro)
- ✅ Design responsivo e acessível
- ✅ Tema claro/escuro

## 📁 Estrutura do Projeto

```
sistema-cursos-melhorado/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   │   ├── ui/        # Componentes UI (shadcn/ui)
│   │   │   └── layout/    # Layouts
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── contexts/      # Contextos React
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/          # Utilitários
│   └── public/           # Arquivos estáticos
├── server/                # Backend (opcional)
├── shared/                # Código compartilhado
└── patches/              # Patches de dependências
```

## 🎨 Design System

O projeto utiliza um design system baseado no conceito **"Neo-Academic Modern"**:

- **Cores**: Paleta indigo/esmeralda com tons suaves
- **Tipografia**: Plus Jakarta Sans (títulos) + Inter (corpo)
- **Espaçamento**: Sistema de espaçamento consistente
- **Componentes**: Baseados em Radix UI para acessibilidade
- **Animações**: Transições suaves e micro-interações

## 🧪 Testes

Consulte o arquivo [TESTE.md](./TESTE.md) para um guia completo de testes.

### Testes Rápidos

1. **Criar um curso**: Navegue para `/cursos` → Clique em "Novo Curso"
2. **Filtrar cursos**: Use os filtros de status e categoria
3. **Criar instrutor**: Navegue para `/instrutores` → Clique em "Novo Instrutor"
4. **Ver dashboard**: Navegue para `/` e veja as estatísticas

## 🚧 Melhorias Futuras

- [ ] Integração com backend/API
- [ ] Persistência de dados (localStorage/banco de dados)
- [ ] Autenticação e autorização
- [ ] Edição de cursos e instrutores
- [ ] Exportação de relatórios em PDF/Excel
- [ ] Sistema de notificações
- [ ] Calendário de eventos
- [ ] Chat em tempo real
- [ ] Upload de imagens para avatares

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvido com

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Chart.js](https://www.chartjs.org/)
- [Wouter](https://github.com/molefrog/wouter)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📧 Contato

Para dúvidas ou sugestões, abra uma [issue](https://github.com/seu-usuario/sistema-cursos-melhorado/issues) no GitHub.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!

