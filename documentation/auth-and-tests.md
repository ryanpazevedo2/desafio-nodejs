/**
 * # Documentação da API - Autenticação e Testes
 * 
 * ## Visão Geral
 * 
 * Esta documentação detalha as novas funcionalidades de autenticação, gerenciamento de usuários e a suíte de testes automatizados implementada no projeto, conforme os requisitos da segunda fase do desafio.
 * 
 * ---
 * 
 * ## 1. Autenticação com JWT (JSON Web Tokens)
 * 
 * A API agora utiliza um sistema de autenticação baseado em tokens JWT para proteger endpoints sensíveis.
 * 
 * ### Endpoints de Autenticação
 * 
 * -   `POST /login`
 *     -   **Descrição**: Autentica um usuário com `usuario` e `senha`.
 *     -   **Corpo da Requisição**: `{ "usuario": "seu_usuario", "senha": "sua_senha" }`
 *     -   **Resposta de Sucesso (200)**: Retorna um token JWT. `{ "token": "seu_jwt_token" }`
 *     -   **Resposta de Falha (401)**: Credenciais inválidas.
 * 
 * -   `POST /logout`
 *     -   **Descrição**: Invalida o token JWT atual do usuário, adicionando-o a uma "blacklist".
 *     -   **Header Obrigatório**: `Authorization: Bearer <seu_jwt_token>`
 *     -   **Resposta de Sucesso (200)**: `{ "message": "Logout bem-sucedido." }`
 * 
 * ### Proteção de Rotas
 * 
 * -   **/clientes**: Todos os endpoints (`GET`, `POST`, `PUT`, `DELETE`) agora exigem um token JWT válido no cabeçalho `Authorization`.
 * -   **/produtos**: Continuam sendo públicos, sem necessidade de autenticação.
 * -   **/usuarios**: 
 *     -   `POST /`: Público, para permitir o cadastro de novos usuários.
 *     -   `GET /`: Protegido, apenas usuários autenticados podem listar outros usuários.
 * 
 * ---
 * 
 * ## 2. Gerenciamento de Usuários
 * 
 * Foi adicionado um CRUD para gerenciar usuários.
 * 
 * ### Tabela `usuarios`
 * 
 * -   `id`: SERIAL PRIMARY KEY
 * -   `usuario`: VARCHAR(100) UNIQUE NOT NULL
 * -   `senha`: VARCHAR(255) NOT NULL (armazenada com hash `bcrypt`)
 * 
 * ### Endpoints de Usuários
 * 
 * -   `POST /usuarios`
 *     -   **Descrição**: Cria um novo usuário.
 *     -   **Corpo da Requisição**: `{ "usuario": "novo_usuario", "senha": "senha_forte" }`
 *     -   **Resposta de Sucesso (201)**: Retorna o usuário criado (sem a senha).
 *     -   **Resposta de Falha (409)**: Se o usuário já existir.
 * 
 * -   `GET /usuarios`
 *     -   **Descrição**: Lista todos os usuários cadastrados.
 *     -   **Header Obrigatório**: `Authorization: Bearer <seu_jwt_token>`
 *     -   **Resposta de Sucesso (200)**: Retorna um array de objetos de usuário.
 * 
 * ---
 * 
 * ## 3. Testes Automatizados
 * 
 * A suíte de testes foi implementada com `Jest` e `Supertest` para garantir a qualidade e o funcionamento correto da API.
 * 
 * ### Como Executar os Testes
 * 
 * Para rodar todos os testes, execute o seguinte comando no terminal:
 * 
 * ```bash
 * npm test
 * ```
 * 
 * ### Cobertura dos Testes
 * 
 * -   **`tests/auth.test.js`**: Testa o fluxo completo de autenticação: cadastro de usuário, login com sucesso e falha, acesso a rotas protegidas, logout e bloqueio de token invalidado.
 * -   **`tests/produtos.test.js`**: Testa todo o CRUD de produtos, incluindo validações de dados inválidos.
 * -   **`tests/clientes.test.js`**: Testa o CRUD de clientes, garantindo que o acesso sem token é bloqueado e que todas as operações funcionam com um token válido.
 * 
 * ### Validações Aprimoradas
 * 
 * Os middlewares de validação foram atualizados para usar `express-validator`, cobrindo todas as regras especificadas no desafio (tamanho de campos, formato de e-mail, ranges de valores numéricos, etc.).
 * 
 */ 