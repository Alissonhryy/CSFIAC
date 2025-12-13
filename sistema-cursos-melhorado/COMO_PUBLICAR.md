# 🚀 Como Publicar no GitHub

## Passo a Passo

### 1. Criar Repositório no GitHub

1. Acesse [GitHub](https://github.com)
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Preencha:
   - **Repository name**: `sistema-cursos-melhorado` (ou outro nome de sua preferência)
   - **Description**: "Sistema moderno de gestão de cursos e instrutores"
   - **Visibility**: Escolha Public ou Private
   - **NÃO marque** "Initialize with README" (já temos um)
5. Clique em **"Create repository"**

### 2. Inicializar Git no Projeto (se ainda não foi feito)

Abra o terminal na pasta do projeto e execute:

```bash
# Navegue até a pasta do projeto
cd sistema-cursos-melhorado/sistema-cursos-melhorado

# Inicialize o repositório Git (se ainda não foi feito)
git init

# Adicione todos os arquivos
git add .

# Faça o primeiro commit
git commit -m "Initial commit: Sistema de gestão de cursos e instrutores"
```

### 3. Conectar ao Repositório GitHub

```bash
# Adicione o repositório remoto (substitua SEU_USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU_USUARIO/sistema-cursos-melhorado.git

# Verifique se foi adicionado corretamente
git remote -v
```

### 4. Enviar para o GitHub

```bash
# Envie o código para o GitHub
git branch -M main
git push -u origin main
```

### 5. Verificar no GitHub

1. Acesse seu repositório no GitHub
2. Verifique se todos os arquivos foram enviados
3. O README.md deve aparecer automaticamente na página inicial

## 📝 Comandos Git Úteis

### Verificar Status
```bash
git status
```

### Adicionar Arquivos Específicos
```bash
git add arquivo.tsx
git add pasta/
```

### Fazer Commit
```bash
git commit -m "Descrição das mudanças"
```

### Enviar Mudanças
```bash
git push
```

### Atualizar do GitHub
```bash
git pull
```

### Ver Histórico
```bash
git log
```

## ⚠️ Arquivos que NÃO serão Enviados

O arquivo `.gitignore` garante que os seguintes arquivos NÃO serão enviados:

- `node_modules/` - Dependências (muito grandes)
- `dist/` - Build de produção
- `.env` - Variáveis de ambiente sensíveis
- Arquivos de sistema (`.DS_Store`, `Thumbs.db`)
- Logs e arquivos temporários

## 🎨 Adicionar Badges ao README

Após publicar, você pode atualizar o README.md com badges reais:

1. Vá para o repositório no GitHub
2. Copie a URL do repositório
3. Atualize os links no README.md (substitua `seu-usuario` pelo seu username)

## 📦 Publicar no GitHub Pages (Opcional)

Para publicar o site estático:

1. Vá em **Settings** do repositório
2. Role até **Pages** no menu lateral
3. Em **Source**, selecione **GitHub Actions**
4. Crie um arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

## ✅ Checklist Antes de Publicar

- [ ] Verificar se `.gitignore` está correto
- [ ] Verificar se não há dados sensíveis no código
- [ ] Verificar se o README.md está completo
- [ ] Testar o projeto localmente (`pnpm dev`)
- [ ] Verificar se não há erros (`pnpm check`)
- [ ] Fazer commit de todas as mudanças
- [ ] Criar repositório no GitHub
- [ ] Fazer push do código

## 🆘 Problemas Comuns

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/sistema-cursos-melhorado.git
```

### Erro: "failed to push"
```bash
# Verifique se você está autenticado
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Arquivos muito grandes
```bash
# Verifique o tamanho dos arquivos
du -sh *
# Se houver arquivos grandes, adicione ao .gitignore
```

---

**Pronto!** Seu projeto está publicado no GitHub! 🎉

