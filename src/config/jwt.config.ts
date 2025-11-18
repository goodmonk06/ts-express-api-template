export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'default-secret-change-this',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
} as const;
