import { Test, TestingModule } from '@nestjs/testing';
import { DevLogger } from './dev.logger';
import { ConsoleLogger } from '@nestjs/common';

describe('DevLogger', () => {
  let devLogger: DevLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevLogger],
    }).compile();

    devLogger = module.get<DevLogger>(DevLogger);
  });

  it('should be defined', () => {
    expect(devLogger).toBeDefined();
  });

  describe('log levels', () => {
    const logTests = [
      { level: 'log', message: 'test message', spyMethod: 'log' },
      { level: 'debug', message: 'test debug', spyMethod: 'debug' },
      { level: 'error', message: 'test error', spyMethod: 'error' },
      { level: 'fatal', message: 'test fatal', spyMethod: 'error' },
    ];

    it.each(logTests)(
      'should format $level messages with [DevLogger] prefix',
      ({ level, message, spyMethod }) => {
        const consoleSpy = jest
          .spyOn(ConsoleLogger.prototype, spyMethod as keyof ConsoleLogger)
          .mockImplementation(() => {});

        (devLogger as any)[level](message);

        expect(consoleSpy).toHaveBeenCalledWith(`[DevLogger] ${message}`);
        consoleSpy.mockRestore();
      },
    );
  });
});
