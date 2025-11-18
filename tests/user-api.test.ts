import request from 'supertest';
import app from '../src/app';

describe('User API Endpoints', () => {
  let authToken: string;
  let userId: string;

  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
      };

      const response = await request(app).post('/api/users/register').send(newUser).expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.user.name).toBe(newUser.name);
      expect(response.body.data.user).not.toHaveProperty('password');

      authToken = response.body.data.token;
      userId = response.body.data.user.id;
    });

    it('should reject registration with invalid email', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      };

      const response = await request(app).post('/api/users/register').send(invalidUser).expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Validation failed');
    });

    it('should reject registration with short password', async () => {
      const invalidUser = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
      };

      const response = await request(app).post('/api/users/register').send(invalidUser).expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('POST /api/users/login', () => {
    const testUser = {
      email: `login-test-${Date.now()}@example.com`,
      password: 'password123',
      name: 'Login Test User',
    };

    beforeAll(async () => {
      await request(app).post('/api/users/register').send(testUser);
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('Protected Routes', () => {
    beforeAll(async () => {
      const response = await request(app).post('/api/users/register').send({
        email: `protected-test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Protected Test User',
      });

      authToken = response.body.data.token;
      userId = response.body.data.user.id;
    });

    describe('GET /api/users/profile', () => {
      it('should get user profile with valid token', async () => {
        const response = await request(app)
          .get('/api/users/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('email');
        expect(response.body.data).not.toHaveProperty('password');
      });

      it('should reject request without token', async () => {
        const response = await request(app).get('/api/users/profile').expect(401);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('No token provided');
      });

      it('should reject request with invalid token', async () => {
        const response = await request(app)
          .get('/api/users/profile')
          .set('Authorization', 'Bearer invalid-token')
          .expect(401);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Invalid token');
      });
    });

    describe('PUT /api/users/profile', () => {
      it('should update user profile', async () => {
        const updateData = {
          name: 'Updated Name',
        };

        const response = await request(app)
          .put('/api/users/profile')
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.data.name).toBe(updateData.name);
      });

      it('should reject update without token', async () => {
        const response = await request(app)
          .put('/api/users/profile')
          .send({ name: 'New Name' })
          .expect(401);

        expect(response.body.status).toBe('error');
      });
    });

    describe('GET /api/users', () => {
      it('should get all users with valid token', async () => {
        const response = await request(app)
          .get('/api/users')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
      });

      it('should reject request without authentication', async () => {
        const response = await request(app).get('/api/users').expect(401);

        expect(response.body.status).toBe('error');
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting', async () => {
      const requests = Array(101)
        .fill(null)
        .map(() => request(app).get('/api/health'));

      const results = await Promise.all(requests);
      const tooManyRequests = results.filter((r) => r.status === 429);

      expect(tooManyRequests.length).toBeGreaterThan(0);
    }, 30000);
  });
});
