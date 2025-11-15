const request = require('supertest');
const { app } = require('../server');
const User = require('../models/User');
const Product = require('../models/Product');

describe('Product API', () => {
  let adminToken, staffToken, customerToken;
  let adminId, productId;

  // Before running tests, create users with different roles and log them in
  beforeEach(async () => {
    // Create Admin User
    const admin = await User.create({ name: 'Admin', email: 'admin@test.com', password: 'password', role: 'admin' });
    adminId = admin._id;

    // Create Staff User
    await User.create({ name: 'Staff', email: 'staff@test.com', password: 'password', role: 'staff' });

    // Create Customer User
    await User.create({ name: 'Customer', email: 'customer@test.com', password: 'password', role: 'customer' });

    // Login users to get tokens
    const adminLoginRes = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'password' });
    adminToken = adminLoginRes.body.token;

    const staffLoginRes = await request(app).post('/api/auth/login').send({ email: 'staff@test.com', password: 'password' });
    staffToken = staffLoginRes.body.token;
    
    const customerLoginRes = await request(app).post('/api/auth/login').send({ email: 'customer@test.com', password: 'password' });
    customerToken = customerLoginRes.body.token;

    // Create a sample product for GET, PUT, DELETE tests
    const product = await Product.create({
      name: 'Sample Laptop',
      category: 'Electronics',
      price: 1200,
      stock: 50,
      createdBy: adminId
    });
    productId = product._id;
  });

  // ==================== GET All Products (Public) ====================
  describe('GET /api/products', () => {
    it('should get all products for anyone', async () => {
      const res = await request(app).get('/api/products');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.products).toBeInstanceOf(Array);
      expect(res.body.products.length).toBeGreaterThan(0);
      expect(res.body.products[0].name).toBe('Sample Laptop');
    });
  });

  // ==================== GET Single Product (Public) ====================
  describe('GET /api/products/:id', () => {
    it('should get a single product by its ID', async () => {
      const res = await request(app).get(`/api/products/${productId}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.name).toBe('Sample Laptop');
    });

    it('should return 404 if product not found', async () => {
        const fakeId = '605a3b4c1a3b4c1a3b4c1a3b'; // A valid but non-existent ObjectId
        const res = await request(app).get(`/api/products/${fakeId}`);
        expect(res.statusCode).toEqual(404);
    });
  });

  // ==================== POST Create Product (Admin Only) ====================
  describe('POST /api/products', () => {
    it('should create a product if user is admin', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Gaming Mouse',
          category: 'Electronics',
          price: 75,
          stock: 100
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.product.name).toBe('New Gaming Mouse');

      const product = await Product.findOne({ name: 'New Gaming Mouse' });
      expect(product).not.toBeNull();
    });

    it('should NOT create a product if user is staff', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({ name: 'Staff Mouse', price: 20, stock: 10, category: 'Electronics' });

      expect(res.statusCode).toEqual(403); // Forbidden
    });

    it('should NOT create a product if user is a customer', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'Customer Mouse', price: 10, stock: 5, category: 'Electronics' });
        
      expect(res.statusCode).toEqual(403); // Forbidden
    });
  });

    // ==================== PUT Update Product (Admin Only) ====================
    describe('PUT /api/products/:id', () => {
        it('should update a product if user is admin', async () => {
            const res = await request(app)
                .put(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ price: 1150, stock: 45 });
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.product.price).toBe(1150);
            expect(res.body.product.stock).toBe(45);
        });

        it('should NOT update a product if user is not admin', async () => {
            const res = await request(app)
                .put(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${staffToken}`)
                .send({ price: 1100 });
            
            expect(res.statusCode).toEqual(403);
        });
    });

    // ==================== DELETE Product (Admin Only) ====================
    describe('DELETE /api/products/:id', () => {
        it('should soft delete a product if user is admin', async () => {
            const res = await request(app)
                .delete(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.statusCode).toEqual(200);
            
            // Verify it was soft-deleted (isActive is false)
            const product = await Product.findById(productId);
            expect(product.isActive).toBe(false);
        });

        it('should NOT delete a product if user is not admin', async () => {
            const res = await request(app)
                .delete(`/api/products/${productId}`)
                .set('Authorization', `Bearer ${customerToken}`);
            
            expect(res.statusCode).toEqual(403);
        });
    });
});