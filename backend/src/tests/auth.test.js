const request = require('supertest');
const { app } = require('../server');
const User = require('../models/User');

describe('Auth API', () => {
  // ==================== REGISTRATION ====================
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('name', 'Test User');
      
      // Check database
      const user = await User.findOne({ email: 'test@example.com' });
      expect(user).not.toBeNull();
    });

    it('should fail if email already exists', async () => {
      // First, create a user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      
      // Then, try to register again with the same email
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Another User',
          email: 'test@example.com',
          password: 'password456',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body.message).toEqual('Email already registered');
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          // Email and password are missing
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('Please provide name, email and password');
    });
  });

  // ==================== LOGIN ====================
  describe('POST /api/auth/login', () => {
    // Create a user before running login tests
    beforeEach(async () => {
      await User.create({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
      });
    });

    it('should login a user successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123',
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'wrongpassword',
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Invalid email or password');
    });

    it('should fail with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('Invalid email or password');
    });
  });
});
