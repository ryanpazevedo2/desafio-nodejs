const request = require('supertest');
const { app, server } = require('../app');
const usuarioService = require('../services/usuarioService');
const authService = require('../services/authService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../services/usuarioService');
jest.mock('../services/authService');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Fechar o servidor após todos os testes
afterAll((done) => {
    server.close(done);
});

describe('Auth Endpoints', () => {
    const testUser = { id: 1, usuario: 'testuser', senha: 'hashedpassword' };
    const token = 'fake-jwt-token';
    const decodedToken = { id: testUser.id, usuario: testUser.usuario, exp: Date.now() / 1000 + 3600 };

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock padrão para um login bem-sucedido
        usuarioService.findUserByUsername.mockResolvedValue(testUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue(token);
        // Mock padrão para um token válido
        authService.isTokenBlacklisted.mockResolvedValue(false);
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, decodedToken);
        });
    });

    it('should create a new user', async () => {
        usuarioService.createUser.mockResolvedValue({ id: 1, usuario: 'testuser' });
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario: 'testuser', senha: 'password123' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('usuario', 'testuser');
    });

    it('should login the user and return a token', async () => {
        const res = await request(app)
            .post('/login')
            .send({ usuario: 'testuser', senha: 'password123' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token', token);
    });

    it('should get all users with a valid token', async () => {
        usuarioService.getAllUsuarios.mockResolvedValue([{ id: 1, usuario: 'testuser' }]);
        const res = await request(app)
            .get('/usuarios')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body[0]).toHaveProperty('usuario', 'testuser');
    });

    it('should logout the user and invalidate the token', async () => {
        authService.blacklistToken.mockResolvedValue();
        const res = await request(app)
            .post('/logout')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
    });

    it('should not allow access with a blacklisted token', async () => {
        authService.isTokenBlacklisted.mockResolvedValue(true); // Token na blacklist
        const res = await request(app)
            .get('/usuarios')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(403);
    });
}); 