import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  const testLogLevel = (
    level: 'log' | 'error' | 'warn',
    method: (message: unknown, ...optionalParams: unknown[]) => void,
    message: string,
    params: ReadonlyArray<string>,
  ) => {
    const consoleSpy = jest.spyOn(console, level).mockImplementation(() => {});

    method(message, ...params);

    expect(consoleSpy).toHaveBeenCalledWith(
      `level=${level}\tmessage="${message}"\toptionalParams=["${params.join('","')}"]\n`,
    );

    consoleSpy.mockRestore();
  };

  test.each([
    ['log', 'log message', ['log param1', 'log param2']],
    ['error', 'error message', ['error param1', 'error param2']],
    ['warn', 'warn message', ['warn param1', 'warn param2']],
  ] as const)(
    'should format and log "%s" messages correctly',
    (level, message, params) => {
      testLogLevel(level, logger[level].bind(logger), message, params);
    },
  );

  test.each([
    ['log', 'log message'],
    ['error', 'error message'],
    ['warn', 'warn message'],
  ] as const)(
    'should handle empty optionalParams correctly for %s',
    (level, message) => {
      const consoleSpy = jest
        .spyOn(console, level)
        .mockImplementation(() => {});

      logger[level](message);

      expect(consoleSpy).toHaveBeenCalledWith(
        `level=${level}\tmessage="${message}"\toptionalParams=\n`,
      );

      consoleSpy.mockRestore();
    },
  );
});
