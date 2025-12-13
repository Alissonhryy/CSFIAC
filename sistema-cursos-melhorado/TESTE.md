# 🧪 Guia de Testes - Sistema de Cursos

## 📋 Pré-requisitos

- Node.js instalado (versão 18 ou superior)
- pnpm instalado (gerenciador de pacotes)

## 🚀 Como Iniciar o Projeto

### 1. Instalar Dependências

```bash
cd sistema-cursos-melhorado
pnpm install
```

### 2. Iniciar o Servidor de Desenvolvimento

```bash
pnpm dev
```

O servidor será iniciado em `http://localhost:3000` (ou na próxima porta disponível).

## ✅ Checklist de Testes

### 🎯 Página de Cursos (`/cursos`)

#### ✅ Teste 1: Busca de Cursos
- [ ] Digite um nome de curso na barra de busca (ex: "React")
- [ ] Verifique se os resultados são filtrados em tempo real
- [ ] Teste buscar por nome de instrutor (ex: "Ana Silva")
- [ ] Verifique se a busca funciona com letras minúsculas/maiúsculas

#### ✅ Teste 2: Filtros
- [ ] Clique no filtro de **Status** e selecione "Em Andamento"
- [ ] Verifique se apenas cursos com status "Em Andamento" são exibidos
- [ ] Teste os outros status: "Concluído" e "Pendente"
- [ ] Clique no filtro de **Categoria** e selecione uma categoria (ex: "Tecnologia")
- [ ] Verifique se apenas cursos dessa categoria são exibidos
- [ ] Combine busca + filtro de status + filtro de categoria
- [ ] Clique no botão **X** para limpar todos os filtros

#### ✅ Teste 3: Criar Novo Curso
- [ ] Clique no botão **"Novo Curso"**
- [ ] Verifique se o modal abre corretamente
- [ ] Tente criar um curso sem preencher campos obrigatórios
- [ ] Verifique se aparece mensagem de erro (toast vermelho)
- [ ] Preencha todos os campos:
  - Nome do Curso: "Teste de Curso"
  - Instrutor: "João Silva"
  - Categoria: Selecione uma categoria
  - Duração: "3 meses"
  - Data de Início: Selecione uma data
  - Descrição: (opcional)
- [ ] Clique em **"Criar Curso"**
- [ ] Verifique se aparece toast de sucesso (verde)
- [ ] Verifique se o novo curso aparece na lista
- [ ] Verifique se o novo curso tem status "Pendente" e 0 alunos

#### ✅ Teste 4: Estado Vazio
- [ ] Digite um termo de busca que não existe (ex: "xyz123")
- [ ] Verifique se aparece mensagem "Nenhum curso encontrado"
- [ ] Verifique se há sugestão para ajustar os filtros
- [ ] Limpe a busca e verifique se os cursos voltam

#### ✅ Teste 5: Ações do Curso
- [ ] Passe o mouse sobre uma linha da tabela
- [ ] Verifique se o botão de ações (três pontos) aparece
- [ ] Clique no botão de ações
- [ ] Verifique se o menu dropdown abre com opções:
  - Editar Detalhes
  - Gerenciar Alunos
  - Arquivar Curso
- [ ] Teste clicar em cada opção (pode não ter funcionalidade ainda)

#### ✅ Teste 6: Animações
- [ ] Observe a entrada suave dos cards/linhas ao carregar a página
- [ ] Passe o mouse sobre os cards e verifique as transições
- [ ] Teste o hover nos botões e elementos interativos

---

### 👥 Página de Instrutores (`/instrutores`)

#### ✅ Teste 1: Busca de Instrutores
- [ ] Digite um nome na barra de busca (ex: "Ana")
- [ ] Verifique se os resultados são filtrados
- [ ] Teste buscar por especialidade (ex: "Web")
- [ ] Limpe a busca

#### ✅ Teste 2: Filtro por Status
- [ ] Clique no filtro de **Status**
- [ ] Selecione "Ativo" - verifique se apenas instrutores ativos aparecem
- [ ] Selecione "Inativo" - verifique se apenas instrutores inativos aparecem
- [ ] Selecione "Licença" - verifique se apenas instrutores em licença aparecem
- [ ] Selecione "Todos os Status" - verifique se todos aparecem
- [ ] Clique no botão **X** para limpar filtros

#### ✅ Teste 3: Criar Novo Instrutor
- [ ] Clique no botão **"Novo Instrutor"**
- [ ] Verifique se o modal abre
- [ ] Tente criar sem preencher campos obrigatórios
- [ ] Verifique mensagem de erro
- [ ] Preencha todos os campos:
  - Nome Completo: "Maria Santos"
  - Cargo/Função: "Desenvolvedora Fullstack"
  - Especialidade: Selecione uma especialidade
  - Email: "maria.santos@csf.edu"
  - Telefone: "+55 11 99999-8888"
- [ ] Clique em **"Adicionar Instrutor"**
- [ ] Verifique toast de sucesso
- [ ] Verifique se o novo instrutor aparece na lista
- [ ] Verifique se o novo instrutor tem 0 cursos, 0 alunos e 0 avaliação

#### ✅ Teste 4: Estado Vazio
- [ ] Digite um termo que não existe na busca
- [ ] Verifique mensagem "Nenhum instrutor encontrado"
- [ ] Limpe a busca

#### ✅ Teste 5: Interações com Instrutor
- [ ] Passe o mouse sobre um card de instrutor
- [ ] Verifique animações de hover (escala, sombra)
- [ ] Clique no botão de três pontos (menu)
- [ ] Verifique opções: Ver Perfil, Editar Dados, Atribuir Curso
- [ ] Clique no botão **Email**
- [ ] Verifique se aparece toast informativo
- [ ] Clique no botão **Chat**
- [ ] Verifique se aparece toast informativo

#### ✅ Teste 6: Visual dos Cards
- [ ] Observe o avatar do instrutor
- [ ] Verifique se o avatar tem animação ao passar o mouse
- [ ] Observe as estatísticas (Cursos, Alunos, Avaliação)
- [ ] Verifique se os números estão destacados
- [ ] Observe o badge de especialidade

---

### 📊 Página Dashboard (`/`)

#### ✅ Teste 1: Estatísticas
- [ ] Verifique se os 4 cards de estatísticas aparecem:
  - Total de Cursos
  - Instrutores Ativos
  - Alunos Matriculados
  - Taxa de Conclusão
- [ ] Verifique se há indicadores de tendência (setas e percentuais)
- [ ] Passe o mouse sobre os cards e verifique animações

#### ✅ Teste 2: Gráficos
- [ ] Verifique se o gráfico de linha "Crescimento de Matrículas" aparece
- [ ] Verifique se o gráfico de rosca "Status dos Cursos" aparece
- [ ] Verifique se os gráficos são responsivos ao redimensionar a janela

#### ✅ Teste 3: Tabela de Cursos Recentes
- [ ] Verifique se a tabela mostra cursos recentes
- [ ] Verifique se há barra de progresso para cada curso
- [ ] Verifique se os status estão coloridos corretamente
- [ ] Passe o mouse sobre as linhas e verifique hover

---

### 🎨 Testes de Interface e UX

#### ✅ Teste 1: Responsividade
- [ ] Redimensione a janela do navegador
- [ ] Teste em modo mobile (F12 > Toggle device toolbar)
- [ ] Verifique se o menu lateral se transforma em menu hambúrguer
- [ ] Verifique se as tabelas têm scroll horizontal em telas pequenas
- [ ] Verifique se os cards se reorganizam em colunas menores

#### ✅ Teste 2: Navegação
- [ ] Clique em cada item do menu lateral:
  - Dashboard
  - Cursos
  - Instrutores
  - Relatórios
  - Configurações
- [ ] Verifique se a rota muda corretamente
- [ ] Verifique se o item ativo fica destacado no menu
- [ ] Teste o menu hambúrguer no mobile

#### ✅ Teste 3: Animações e Transições
- [ ] Observe as animações ao mudar de página
- [ ] Verifique transições suaves nos hovers
- [ ] Teste abertura/fechamento de modais
- [ ] Verifique animações escalonadas nas listas

#### ✅ Teste 4: Feedback Visual
- [ ] Crie um curso com sucesso - verifique toast verde
- [ ] Tente criar sem preencher campos - verifique toast vermelho
- [ ] Clique em botões e verifique estados de hover/active
- [ ] Verifique se campos obrigatórios estão marcados com *

---

## 🐛 Problemas Conhecidos / A Melhorar

- Os botões "Editar Detalhes", "Gerenciar Alunos" ainda não têm funcionalidade
- Os botões "Email" e "Chat" apenas mostram toasts informativos
- A busca global no header ainda não está conectada
- Os dados são apenas mock (não persistem após recarregar a página)

---

## 💡 Dicas de Teste

1. **Teste em diferentes navegadores**: Chrome, Firefox, Edge
2. **Teste em diferentes tamanhos de tela**: Desktop, Tablet, Mobile
3. **Teste com diferentes dados**: Crie vários cursos e instrutores
4. **Teste casos extremos**: 
   - Busca vazia
   - Muitos filtros combinados
   - Campos muito longos
   - Caracteres especiais

---

## 📝 Notas

- Os dados são armazenados apenas em memória (state do React)
- Ao recarregar a página, os dados criados serão perdidos
- Para persistência real, seria necessário conectar a um backend/API

---

## 🎯 Resultado Esperado

Após todos os testes, você deve ter:
- ✅ Sistema funcional com filtros e busca
- ✅ Criação de cursos e instrutores funcionando
- ✅ Interface responsiva e animada
- ✅ Feedback visual adequado (toasts, estados vazios)
- ✅ Experiência de usuário fluida e moderna

