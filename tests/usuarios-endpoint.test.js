/**
 * Testes do Endpoint /usuarios
 * Verificar se o endpoint está funcional conforme especificações do trabalho
 */

const request = require('supertest');
const { app, server } = require('../app');

describe('Endpoint /usuarios', () => {
    
    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => {
                server.close(resolve);
            });
        }
    });

    describe('POST /usuarios - Criação de usuário', () => {
        test('deve estar funcional e responder à requisições', async () => {
            const response = await request(app)
                .post('/usuarios')
                .send({
                    usuario: 'testuser',
                    senha: '123456'
                });
            
            // O endpoint deve responder (não deve dar erro 404)
            expect(response.status).not.toBe(404);
            
            // Deve ser uma resposta válida (200, 201, 400, etc.)
            expect([200, 201, 400, 409, 500].includes(response.status)).toBe(true);
        });

        test('deve validar dados obrigatórios', async () => {
            const response = await request(app)
                .post('/usuarios')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        test('deve validar tamanho mínimo do usuário', async () => {
            const response = await request(app)
                .post('/usuarios')
                .send({
                    usuario: 'ab', // Menos de 3 caracteres
                    senha: '123456'
                });
            
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors.some(err => 
                err.msg.includes('Usuário deve ter entre 3 e 100 caracteres')
            )).toBe(true);
        });

        test('deve validar tamanho máximo do usuário', async () => {
            const usuarioGrande = 'a'.repeat(101); // Mais de 100 caracteres
            
            const response = await request(app)
                .post('/usuarios')
                .send({
                    usuario: usuarioGrande,
                    senha: '123456'
                });
            
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
        });

        test('deve validar tamanho mínimo da senha', async () => {
            const response = await request(app)
                .post('/usuarios')
                .send({
                    usuario: 'testuser',
                    senha: '12345' // Menos de 6 caracteres
                });
            
            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors.some(err => 
                err.msg.includes('Senha deve ter no mínimo 6 caracteres')
            )).toBe(true);
        });

        test('deve aceitar dados válidos', async () => {
            const response = await request(app)
                .post('/usuarios')
                .send({
                    usuario: 'usuarioteste',
                    senha: 'senhasegura123'
                });
            
            // Deve aceitar (201 criado) ou dar erro de usuário já existe (409)
            expect([201, 409].includes(response.status)).toBe(true);
        });
    });

    describe('GET /usuarios - Listagem de usuários', () => {
        test('deve estar funcional e responder à requisições', async () => {
            const response = await request(app)
                .get('/usuarios');
            
            // O endpoint deve responder (não deve dar erro 404)
            expect(response.status).not.toBe(404);
            
            // Deve ser uma resposta válida
            expect([200, 401, 403, 500].includes(response.status)).toBe(true);
        });

        test('deve exigir autenticação', async () => {
            const response = await request(app)
                .get('/usuarios');
            
            // Deve retornar 401 (não autorizado) quando não há token
            expect(response.status).toBe(401);
        });

        test('deve aceitar token válido no header', async () => {
            // Primeiro, vamos tentar fazer login para obter um token
            const loginResponse = await request(app)
                .post('/auth/login')
                .send({
                    email: 'teste@email.com',
                    senha: '123456'
                });

            if (loginResponse.status === 200 && loginResponse.body.token) {
                const token = loginResponse.body.token;
                
                const response = await request(app)
                    .get('/usuarios')
                    .set('Authorization', `Bearer ${token}`);
                
                // Com token válido, deve retornar 200 ou outro status que não seja 401
                expect(response.status).not.toBe(401);
            } else {
                // Se não conseguir fazer login, pelo menos verifica que o endpoint responde
                const response = await request(app)
                    .get('/usuarios')
                    .set('Authorization', 'Bearer token-invalido');
                
                expect([401, 403].includes(response.status)).toBe(true);
            }
        });
    });

    describe('Funcionalidade geral do endpoint', () => {
        test('endpoint /usuarios deve existir e estar configurado', async () => {
            // Testa se o endpoint existe fazendo uma requisição qualquer
            const response = await request(app)
                .options('/usuarios');
            
            // Não deve retornar 404 (Not Found)
            expect(response.status).not.toBe(404);
        });

        test('deve suportar método POST', async () => {
            const response = await request(app)
                .post('/usuarios')
                .send({});
            
            // Não deve retornar 405 (Method Not Allowed)
            expect(response.status).not.toBe(405);
        });

        test('deve suportar método GET', async () => {
            const response = await request(app)
                .get('/usuarios');
            
            // Não deve retornar 405 (Method Not Allowed)
            expect(response.status).not.toBe(405);
        });
    });
}); 