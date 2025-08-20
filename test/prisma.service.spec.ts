import { PrismaService } from '../src/prisma/prisma.service';

describe('PrismaService', () => {
  it('should connect and disconnect', async () => {
    const service = new PrismaService();
    const connectSpy = jest.spyOn(service, '$connect').mockResolvedValue(undefined as any);
    const disconnectSpy = jest.spyOn(service, '$disconnect').mockResolvedValue(undefined as any);
    await service.onModuleInit();
    await service.onModuleDestroy();
    expect(connectSpy).toHaveBeenCalled();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('should wrap transaction callback and return result', async () => {
    const service = new PrismaService();
    const txResult = { foo: 'bar' };
    const txSpy = jest.spyOn(service, '$transaction').mockImplementation(async (cb: any) => cb({}));
    const result = await service.executeTransaction(async () => {
      return txResult;
    });
    expect(txSpy).toHaveBeenCalled();
    expect(result).toEqual(txResult);
  });
});