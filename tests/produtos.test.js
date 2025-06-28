const request = require('supertest');
const { app, server } = require('../app');
const produtoService = require('../services/produtoService');

jest.mock('../services/produtoService');

afterAll((done) => {
    server.close(done);
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Produtos Endpoints (Public)', () => {
    const mockProduto = { id: 1, nome: "Produto Mock", descricao: "Descrição Mock", preco: 50.00 };
    const newProduto = {
        nome: "Produto de Teste",
        descricao: "Descrição do produto de teste",
        preco: 99.99,
        data_atualizado: "2024-01-01T12:00:00.000Z"
    };


    it('should create a new produto', async () => {
        produtoService.createProduto.mockResolvedValue({ id: 1, ...newProduto });
        
        const res = await request(app)
            .post('/produtos')
            .send(newProduto);
            
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.nome).toBe(newProduto.nome);
    });

    it('should get all produtos', async () => {
        produtoService.getAllProdutos.mockResolvedValue([mockProduto]);
        const res = await request(app).get('/produtos');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([mockProduto]);
    });

    it('should get a produto by id', async () => {
        produtoService.getProdutoById.mockResolvedValue(mockProduto);
        const res = await request(app).get('/produtos/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockProduto);
    });

    it('should delete a produto', async () => {
        produtoService.deleteProduto.mockResolvedValue({ success: true });
        const res = await request(app).delete('/produtos/1');
        expect(res.statusCode).toEqual(200);
    });

    it('should fail to create a produto with invalid data', async () => {
        const res = await request(app)
            .post('/produtos')
            .send({ nome: "a", preco: -10 });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
        expect(produtoService.createProduto).not.toHaveBeenCalled();
    });
}); 