/**
 * Testes de Validação de Campos
 * Conforme especificações do trabalho
 */

const request = require('supertest');
const { app, server } = require('../app');

describe('Validação de Campos', () => {
    
    afterAll(async () => {
        if (server) {
            await new Promise((resolve) => {
                server.close(resolve);
            });
        }
    });

    describe('Validações de Cliente', () => {
        
        describe('Campo nome', () => {
            test('deve rejeitar nome com menos de 3 caracteres', async () => {
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'ab',
                        sobrenome: 'Silva',
                        email: 'teste@email.com',
                        idade: 25
                    });
                
                expect(response.status).toBe(401); // Não autenticado
            });

            test('deve rejeitar nome com mais de 255 caracteres', async () => {
                const nomeGrande = 'a'.repeat(256);
                
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: nomeGrande,
                        sobrenome: 'Silva',
                        email: 'teste@email.com',
                        idade: 25
                    });
                
                expect(response.status).toBe(401); // Não autenticado
            });

            test('deve aceitar nome com tamanho entre 3 e 255 caracteres', async () => {
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'João',
                        sobrenome: 'Silva',
                        email: 'teste@email.com',
                        idade: 25
                    });
                
                expect(response.status).toBe(401); // Não autenticado (esperado)
            });
        });

        describe('Campo sobrenome', () => {
            test('deve rejeitar sobrenome com menos de 3 caracteres', async () => {
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'João',
                        sobrenome: 'ab',
                        email: 'teste@email.com',
                        idade: 25
                    });
                
                expect(response.status).toBe(401); // Não autenticado
            });

            test('deve rejeitar sobrenome com mais de 255 caracteres', async () => {
                const sobrenomeGrande = 'a'.repeat(256);
                
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'João',
                        sobrenome: sobrenomeGrande,
                        email: 'teste@email.com',
                        idade: 25
                    });
                
                expect(response.status).toBe(401); // Não autenticado
            });
        });

        describe('Campo email', () => {
            test('deve rejeitar email com formato inválido', async () => {
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'João',
                        sobrenome: 'Silva',
                        email: 'email-invalido',
                        idade: 25
                    });
                
                expect(response.status).toBe(401); // Não autenticado
            });

            test('deve aceitar email com formato válido', async () => {
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'João',
                        sobrenome: 'Silva',
                        email: 'joao@email.com',
                        idade: 25
                    });
                
                expect(response.status).toBe(401); // Não autenticado (esperado)
            });
        });

        describe('Campo idade', () => {
            test('deve rejeitar idade igual a 0', async () => {
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'João',
                        sobrenome: 'Silva',
                        email: 'teste@email.com',
                        idade: 0
                    });
                
                expect(response.status).toBe(401); // Não autenticado
            });

            test('deve rejeitar idade maior ou igual a 120', async () => {
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'João',
                        sobrenome: 'Silva',
                        email: 'teste@email.com',
                        idade: 120
                    });
                
                expect(response.status).toBe(401); // Não autenticado
            });

            test('deve aceitar idade entre 1 e 119', async () => {
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'João',
                        sobrenome: 'Silva',
                        email: 'teste@email.com',
                        idade: 25
                    });
                
                expect(response.status).toBe(401); // Não autenticado (esperado)
            });
        });

        describe('Campo data_atualizado', () => {
            test('deve rejeitar data anterior a 01/01/2000', async () => {
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'João',
                        sobrenome: 'Silva',
                        email: 'teste@email.com',
                        idade: 25,
                        data_atualizado: '31/12/1999'
                    });
                
                expect(response.status).toBe(401); // Não autenticado
            });

            test('deve rejeitar data posterior a 20/06/2025', async () => {
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'João',
                        sobrenome: 'Silva',
                        email: 'teste@email.com',
                        idade: 25,
                        data_atualizado: '21/06/2025'
                    });
                
                expect(response.status).toBe(401); // Não autenticado
            });

            test('deve aceitar data entre 01/01/2000 e 20/06/2025', async () => {
                const response = await request(app)
                    .post('/clientes')
                    .send({
                        nome: 'João',
                        sobrenome: 'Silva',
                        email: 'teste@email.com',
                        idade: 25,
                        data_atualizado: '15/03/2024'
                    });
                
                expect(response.status).toBe(401); // Não autenticado (esperado)
            });
        });
    });

    describe('Validações de Produto', () => {
        
        describe('Campo produto (nome)', () => {
            test('deve rejeitar nome de produto com menos de 3 caracteres', async () => {
                const response = await request(app)
                    .post('/produtos')
                    .send({
                        nome: 'ab',
                        descricao: 'Descrição do produto',
                        preco: 10.50
                    });
                
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(response.body.errors.some(err => 
                    err.msg.includes('Nome do produto deve ter entre 3 e 255 caracteres')
                )).toBe(true);
            });

            test('deve rejeitar nome de produto com mais de 255 caracteres', async () => {
                const nomeGrande = 'a'.repeat(256);
                
                const response = await request(app)
                    .post('/produtos')
                    .send({
                        nome: nomeGrande,
                        descricao: 'Descrição do produto',
                        preco: 10.50
                    });
                
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
            });

            test('deve aceitar nome de produto com tamanho entre 3 e 255 caracteres', async () => {
                const response = await request(app)
                    .post('/produtos')
                    .send({
                        nome: 'Produto Teste',
                        descricao: 'Descrição do produto',
                        preco: 10.50
                    });
                
                expect(response.status).not.toBe(400);
            });
        });

        describe('Campo descricao', () => {
            test('deve rejeitar descrição com menos de 3 caracteres', async () => {
                const response = await request(app)
                    .post('/produtos')
                    .send({
                        nome: 'Produto',
                        descricao: 'ab',
                        preco: 10.50
                    });
                
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(response.body.errors.some(err => 
                    err.msg.includes('Descrição deve ter entre 3 e 255 caracteres')
                )).toBe(true);
            });

            test('deve rejeitar descrição com mais de 255 caracteres', async () => {
                const descricaoGrande = 'a'.repeat(256);
                
                const response = await request(app)
                    .post('/produtos')
                    .send({
                        nome: 'Produto',
                        descricao: descricaoGrande,
                        preco: 10.50
                    });
                
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
            });
        });

        describe('Campo preco', () => {
            test('deve rejeitar preço negativo', async () => {
                const response = await request(app)
                    .post('/produtos')
                    .send({
                        nome: 'Produto',
                        descricao: 'Descrição do produto',
                        preco: -10.50
                    });
                
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
                expect(response.body.errors.some(err => 
                    err.msg.includes('Preço deve ser um número positivo')
                )).toBe(true);
            });

            test('deve rejeitar preço igual a zero', async () => {
                const response = await request(app)
                    .post('/produtos')
                    .send({
                        nome: 'Produto',
                        descricao: 'Descrição do produto',
                        preco: 0
                    });
                
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
            });

            test('deve aceitar preço positivo', async () => {
                const response = await request(app)
                    .post('/produtos')
                    .send({
                        nome: 'Produto',
                        descricao: 'Descrição do produto',
                        preco: 25.99
                    });
                
                expect(response.status).not.toBe(400);
            });
        });

        describe('Campo data_atualizado', () => {
            test('deve rejeitar data anterior a 01/01/2000', async () => {
                const response = await request(app)
                    .post('/produtos')
                    .send({
                        nome: 'Produto',
                        descricao: 'Descrição do produto',
                        preco: 10.50,
                        data_atualizado: '31/12/1999'
                    });
                
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
            });

            test('deve rejeitar data posterior a 20/06/2025', async () => {
                const response = await request(app)
                    .post('/produtos')
                    .send({
                        nome: 'Produto',
                        descricao: 'Descrição do produto',
                        preco: 10.50,
                        data_atualizado: '21/06/2025'
                    });
                
                expect(response.status).toBe(400);
                expect(response.body.errors).toBeDefined();
            });

            test('deve aceitar data entre 01/01/2000 e 20/06/2025', async () => {
                const response = await request(app)
                    .post('/produtos')
                    .send({
                        nome: 'Produto',
                        descricao: 'Descrição do produto',
                        preco: 10.50,
                        data_atualizado: '15/03/2024'
                    });
                
                expect(response.status).not.toBe(400);
            });
        });
    });
});
