import { authService } from '../src/services/auth.service';

describe('AuthService', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await authService.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await authService.hashPassword(password);
      const hash2 = await authService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should verify correct password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await authService.hashPassword(password);
      const isValid = await authService.comparePassword(password, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashedPassword = await authService.hashPassword(password);
      const isValid = await authService.comparePassword(wrongPassword, hashedPassword);

      expect(isValid).toBe(false);
    });
  });

  describe('JWT Token', () => {
    it('should generate valid JWT token', () => {
      const userId = 'test-user-id-123';
      const token = authService.generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should verify valid token', () => {
      const userId = 'test-user-id-123';
      const token = authService.generateToken(userId);
      const decoded = authService.verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(userId);
    });

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = authService.verifyToken(invalidToken);

      expect(decoded).toBeNull();
    });

    it('should reject tampered token', () => {
      const userId = 'test-user-id-123';
      const token = authService.generateToken(userId);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';
      const decoded = authService.verifyToken(tamperedToken);

      expect(decoded).toBeNull();
    });
  });
});
