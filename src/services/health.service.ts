export class HealthService {
  getHealthStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}

export const healthService = new HealthService();
