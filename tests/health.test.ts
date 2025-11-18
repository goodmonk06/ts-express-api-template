import request from 'supertest';
import app from '../src/app';

describe('Health Endpoint', () => {
  describe('GET /api/health', () => {
    it('should return 200 OK with health status', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.timestamp).toBe('string');
    });

    it('should have correct response structure', async () => {
      const response = await request(app).get('/api/health');

      expect(response.type).toBe('application/json');
      expect(response.body).toMatchObject({
        status: expect.any(String),
        timestamp: expect.any(String),
      });
    });
  });
});
