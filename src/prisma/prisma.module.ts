import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule provides a global instance of PrismaService so it can
 * be injected into any other providers without needing to reimport
 * in each feature module.  Marking it as @Global means that once
 * imported in AppModule it will be available everywhere.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}