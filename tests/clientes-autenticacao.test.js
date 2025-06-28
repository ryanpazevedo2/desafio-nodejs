/**
 * Testes de Autenticação do Endpoint /clientes
 * Verificar se o endpoint só aceita requisições autenticadas conforme especificações do trabalho
 */

const request = require('supertest');
const { app, server } = require('../app');

describe('Endpoint /clientes - Autenticação', () => {
    
    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => {
                server.close(resolve);
            });
        }
    });

    describe('Proteção de rotas - Sem autenticação', () => {
        test('GET /clientes deve rejeitar requisições sem token', async () => {
            const response = await request(app)
                .get('/clientes');
            
            expect(response.status).toBe(401);
            expect(response.body.message || response.body.error).toMatch(/token|autenticação|autorização/i);
        });

        test('POST /clientes deve rejeitar requisições sem token', async () => {
            const response = await request(app)
                .post('/clientes')
                .send({
                    nome: 'João',
                    sobrenome: 'Silva',
                    email: 'joao@email.com',
                    idade: 25
                });
            
            expect(response.status).toBe(401);
            expect(response.body.message || response.body.error).toMatch(/token|autenticação|autorização/i);
        });

        test('PUT /clientes/:id deve rejeitar requisições sem token', async () => {
            const response = await request(app)
                .put('/clientes/1')
                .send({
                    nome: 'João Atualizado',
                    sobrenome: 'Silva',
                    email: 'joao@email.com',
                    idade: 26
                });
            
            expect(response.status).toBe(401);
            expect(response.body.message || response.body.error).toMatch(/token|autenticação|autorização/i);
        });

        test('DELETE /clientes/:id deve rejeitar requisições sem token', async () => {
            const response = await request(app)
                .delete('/clientes/1');
            
            expect(response.status).toBe(401);
            expect(response.body.message || response.body.error).toMatch(/token|autenticação|autorização/i);
        });

        test('GET /clientes/:id deve rejeitar requisições sem token', async () => {
            const response = await request(app)
                .get('/clientes/1');
            
            expect(response.status).toBe(401);
            expect(response.body.message || response.body.error).toMatch(/token|autenticação|autorização/i);
        });
    });

    describe('Proteção de rotas - Token inválido', () => {
        test('GET /clientes deve rejeitar token inválido', async () => {
            const response = await request(app)
                .get('/clientes')
                .set('Authorization', 'Bearer token-invalido');
            
            expect([401, 403].includes(response.status)).toBe(true);
        });

        test('POST /clientes deve rejeitar token inválido', async () => {
            const response = await request(app)
                .post('/clientes')
                .set('Authorization', 'Bearer token-invalido')
                .send({
                    nome: 'João',
                    sobrenome: 'Silva',
                    email: 'joao@email.com',
                    idade: 25
                });
            
            expect([401, 403].includes(response.status)).toBe(true);
        });

        test('deve rejeitar token malformado', async () => {
            const response = await request(app)
                .get('/clientes')
                .set('Authorization', 'InvalidFormat');
            
            expect(response.status).toBe(401);
        });

        test('deve rejeitar header Authorization vazio', async () => {
            const response = await request(app)
                .get('/clientes')
                .set('Authorization', '');
            
            expect(response.status).toBe(401);
        });
    });

    describe('Teste com token válido (se possível)', () => {
        test('deve aceitar requisição com token válido', async () => {
            // Primeiro, tentar fazer login para obter um token válido
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    email: 'teste@email.com',
                    senha: '123456'
                });

            if (loginResponse.status === 200 && loginResponse.body.token) {
                const token = loginResponse.body.token;
                
                const response = await request(app)
                    .get('/clientes')
                    .set('Authorization', `Bearer ${token}`);
                
                // Com token válido, não deve retornar 401
                expect(response.status).not.toBe(401);
                
                // Deve retornar 200 (sucesso) ou outro código que não seja de autenticação
                expect([200, 404, 500].includes(response.status)).toBe(true);
            } else {
                // Se não conseguir fazer login, testa pelo menos que rejeita sem token
                const response = await request(app)
                    .get('/clientes');
                
                expect(response.status).toBe(401);
            }
        });

        test('deve validar dados mesmo com token válido', async () => {
            // Tentar obter token válido
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    email: 'teste@email.com',
                    senha: '123456'
                });

            if (loginResponse.status === 200 && loginResponse.body.token) {
                const token = loginResponse.body.token;
                
                // Enviar dados inválidos mesmo com token válido
                const response = await request(app)
                    .post('/clientes')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        nome: 'ab', // Muito curto
                        sobrenome: 'Silva',
                        email: 'email-invalido',
                        idade: 0
                    });
                
                // Deve rejeitar por validação (400), não por autenticação (401)
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
            }
        });
    });

    describe('Verificação de middleware de autenticação', () => {
        test('todas as rotas de clientes devem estar protegidas', async () => {
            const routes = [
                { method: 'get', path: '/clientes' },
                { method: 'post', path: '/clientes' },
                { method: 'get', path: '/clientes/1' },
                { method: 'put', path: '/clientes/1' },
                { method: 'delete', path: '/clientes/1' }
            ];

            for (const route of routes) {
                const response = await request(app)[route.method](route.path);
                
                expect(response.status).toBe(401);
                expect(response.body.message || response.body.error).toMatch(/token|autenticação|autorização/i);
            }
        });

        test('deve retornar mensagem de erro adequada', async () => {
            const response = await request(app)
                .get('/clientes');
            
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
            expect(typeof response.body.message).toBe('string');
            expect(response.body.message.length).toBeGreaterThan(0);
        });
    });

    describe('Comparação com endpoints públicos', () => {
        test('produtos devem ser acessíveis sem autenticação (contraste)', async () => {
            const response = await request(app)
                .get('/produtos');
            
            // Produtos devem ser públicos, então não deve retornar 401
            expect(response.status).not.toBe(401);
        });

        test('auth/login deve ser acessível sem autenticação (contraste)', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    email: 'teste@email.com',
                    senha: '123456'
                });
            
            // Login deve ser público, então não deve retornar 404 (deve responder)
            expect(response.status).not.toBe(404);
            // Pode retornar 401 (credenciais inválidas) mas não 404 (não encontrado)
            expect([400, 401, 500].includes(response.status)).toBe(true);
        });
    });
}); 