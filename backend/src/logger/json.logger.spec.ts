import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let jsonLogger: JsonLogger;
  const logMock = jest.fn();
  const errorMock = jest.fn();
  const warnMock = jest.fn();

  beforeEach(() => {
    jsonLogger = new JsonLogger();

    console.log = logMock;
    console.error = errorMock;
    console.warn = warnMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const testLogMethod = (
    level: 'log' | 'warn' | 'error',
    method: () => void,
    message: unknown,
    optionalParams: unknown[],
  ) => {
    const mockMethod = { log: logMock, warn: warnMock, error: errorMock }[
      level
    ];
    method();
    expect(mockMethod).toHaveBeenCalledWith(
      JSON.stringify({
        level,
        message,
        optionalParams,
      }),
    );
  };

  test.each([
    ['log', 'Log message', ['param1', 2, true] as unknown[]],
    ['error', 'Error message', ['param1', 2, true] as unknown[]],
    ['warn', 'Warn message', ['param1', 2, true] as unknown[]],
    ['log', '', ['param1', 2] as unknown[]],
    ['log', 'Test message', [] as unknown[]],
    ['log', { key: 'value' }, [42, true] as unknown[]],
  ] as const)(
    'should log messages with level "%s" and correct message and parameters',
    (level, message, optionalParams) => {
      const method =
        level === 'log'
          ? () => jsonLogger.log(message, ...optionalParams)
          : level === 'warn'
            ? () => jsonLogger.warn(message, ...optionalParams)
            : () => jsonLogger.error(message, ...optionalParams);

      testLogMethod(level, method, message, optionalParams);
    },
  );
});
