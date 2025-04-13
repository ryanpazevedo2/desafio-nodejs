# Desafio Node.js API

API REST desenvolvida com Node.js e Supabase como parte do desafio de desenvolvimento back-end.

## Estrutura do Projeto

```
├── configs/         # Arquivos de configuração
├── controllers/     # Arquivos que tratam da lógica de negócios
├── middlewares/     # Validações de campos das requisições
├── models/          # Arquivos SQL para criação de banco de dados
├── routes/          # APIs e endpoints
├── services/        # Chamadas ao banco de dados
├── views/           # Camada de apresentação
├── .env             # Variáveis de ambiente
├── .eslintrc.json   # Configuração do ESLint
├── .gitignore       # Arquivos ignorados pelo Git
├── app.js           # Arquivo principal da aplicação
├── package.json     # Dependências e scripts
└── README.md        # Documentação do projeto
```

## Requisitos

- Node.js
- Conta no Supabase

## Instalação

1. Clone o repositório
```
git clone https://github.com/seu-usuario/desafio-node-api.git
cd desafio-node-api
```

2. Instale as dependências
```
npm install
```

3. Configure o Supabase
- Crie uma conta no [Supabase](https://supabase.com) se ainda não tiver
- Crie um novo projeto
- Obtenha a URL e a chave anônima do seu projeto
- Configure essas credenciais no arquivo `.env`

```
SUPABASE_URL=sua_url_do_supabase
SUPABASE_KEY=sua_chave_anonima_do_supabase
```

- Crie as tabelas necessárias no Supabase usando o SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    idade INT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    data_atualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Execute a aplicação
```
npm run dev
```

## Endpoints

### Raiz
- GET / - Retorna uma mensagem de boas-vindas

### Clientes
- GET /clientes - Lista todos os clientes
- GET /clientes/:id - Retorna um cliente específico
- POST /clientes - Cria um novo cliente
- PUT /clientes/:id - Atualiza um cliente existente
- DELETE /clientes/:id - Remove um cliente

### Produtos
- GET /produtos - Lista todos os produtos
- GET /produtos/:id - Retorna um produto específico
- POST /produtos - Cria um novo produto
- PUT /produtos/:id - Atualiza um produto existente
- DELETE /produtos/:id - Remove um produto

## Tecnologias Utilizadas

- Node.js
- Express
- Supabase (PostgreSQL)
- ESLint
