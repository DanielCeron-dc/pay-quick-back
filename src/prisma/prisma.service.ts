import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService extends the generated PrismaClient and exposes lifecycle
 * hooks so that it can be cleanly connected and disconnected by NestJS.
 * It also provides a helper for executing multiple queries in a
 * database transaction.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Wrap a set of database operations in a single atomic transaction.
   *
   * @param fn a callback that receives the transactional prisma client
   *           and returns a promise.  If the promise resolves the
   *           transaction will be committed; if it rejects the
   *           transaction will be rolled back.
   */
  async executeTransaction<T>(fn: (prisma: any) => Promise<T>): Promise<T> {
    // Use a loosely typed callback to avoid TypeScript's strict
    // incompatibility with the Prisma TransactionClient type.  The
    // callback will receive a transactional client instance from
    // Prisma.$transaction under the hood.
    return this.$transaction(fn);
  }
}