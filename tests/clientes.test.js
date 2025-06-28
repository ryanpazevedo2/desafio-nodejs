const request = require('supertest');
const { app, server } = require('../app');
const clienteService = require('../services/clienteService');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');

jest.mock('../services/clienteService');
jest.mock('../services/authService');
jest.mock('jsonwebtoken');

const token = 'fake-jwt-token';

afterAll((done) => {
    server.close(done);
});

beforeEach(() => {
    // Resetar mocks antes de cada teste
    jest.clearAllMocks();
    // Configuração padrão para token válido
    authService.isTokenBlacklisted.mockResolvedValue(false);
    jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1, usuario: 'testuser' });
    });
});

describe('Clientes Endpoints (Protected)', () => {
    const mockCliente = { id: 1, nome: "Cliente Mock", sobrenome: "Teste", email: "mock@teste.com", idade: 33 };

    it('should not allow access without a token', async () => {
        // O middleware de autenticação vai barrar, então não precisamos mockar o serviço
        const res = await request(app).get('/clientes');
        expect(res.statusCode).toEqual(401);
    });

    it('should create a new cliente with a valid token', async () => {
        clienteService.createCliente.mockResolvedValue(mockCliente);

        const res = await request(app)
            .post('/clientes')
            .set('Authorization', `Bearer ${token}`)
            .send(mockCliente);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(mockCliente);
    });

    it('should get all clientes', async () => {
        clienteService.getAllClientes.mockResolvedValue([mockCliente]);
        
        const res = await request(app)
            .get('/clientes')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([mockCliente]);
    });
    
    it('should get a cliente by id', async () => {
        clienteService.getClienteById.mockResolvedValue(mockCliente);

        const res = await request(app)
            .get('/clientes/1')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockCliente);
    });
    
    it('should delete a cliente', async () => {
        clienteService.deleteCliente.mockResolvedValue({ success: true });

        const res = await request(app)
            .delete('/clientes/1')
            .set('Authorization', `Bearer ${token}`);
            
        expect(res.statusCode).toEqual(200);
    });
}); 