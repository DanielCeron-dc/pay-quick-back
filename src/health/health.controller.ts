import { Controller, Get } from '@nestjs/common';

/**
 * Simple health check endpoint.  Used by Postman to verify that the
 * backend is up and running.  Always returns a static status.
 */
@Controller('health')
export class HealthController {
  @Get()
  health() {
    return { status: 'ok' };
  }
}