import { HealthController } from '../src/health/health.controller';

describe('HealthController', () => {
  it('should return status ok', () => {
    const controller = new HealthController();
    expect(controller.health()).toEqual({ status: 'ok' });
  });
});