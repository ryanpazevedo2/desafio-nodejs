# Documentação Cache e Logging

## Cache

O sistema implementa um mecanismo de cache para melhorar o desempenho das operações de leitura, especialmente para a listagem de clientes.

### Características do Cache

- **Biblioteca**: `node-cache` - uma implementação de cache em memória para Node.js
- **Tempo de expiração (TTL)**: 30 segundos
- **Operações com Cache**:
  - `GET /clientes` - Os resultados são armazenados em cache por 30 segundos
  - Invalidação automática após qualquer operação de escrita (POST, PUT, DELETE)

### Funcionamento

1. Quando uma requisição `GET /clientes` é feita, o sistema verifica se existe um cache válido
2. Se existe, retorna os dados do cache sem consultar o banco de dados
3. Se não existe, busca os dados no banco e armazena no cache para requisições futuras
4. Após qualquer operação que modifique os dados (POST, PUT, DELETE), o cache é invalidado automaticamente

## Logging

O sistema implementa um mecanismo de logging para registrar as operações e facilitar o diagnóstico de problemas.

### Características do Logging

- **Bibliotecas**:
  - `chalk` - para colorir os logs no terminal
  - `winston` - para persistir logs em arquivos

### Categorias de Logs

- **[CACHE]** (Azul) - Operações relacionadas ao cache
- **[DB]** (Verde) - Operações relacionadas ao banco de dados
- **[ERROR]** (Vermelho) - Erros e exceções
- **[INFO]** (Ciano) - Informações gerais do sistema

### Arquivos de Log

Os logs são armazenados em arquivos na pasta `/logs`:
- `combined.log` - Todos os logs
- `error.log` - Apenas logs de erro

### Exemplos de Logs

Terminal:
```
[CACHE] Listando clientes do cache
[DB] Listando clientes do banco de dados
[INFO] Cache de clientes invalidado
[DB] Cliente criado: João Silva
[ERROR] Erro ao buscar cliente ID undefined TypeError: Cannot read property 'id' of undefined
```

Arquivo de log:
```
2024-05-21 12:34:56 info: [CACHE] Listando clientes do cache
2024-05-21 12:35:01 info: [DB] Listando clientes do banco de dados
2024-05-21 12:35:10 info: [INFO] Cache de clientes invalidado
2024-05-21 12:35:20 info: [DB] Cliente criado: João Silva
2024-05-21 12:35:30 error: [ERROR] Erro ao buscar cliente ID undefined TypeError: Cannot read property 'id' of undefined
``` 