import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { logger } from '../stdio/logger.js';

describe('stdio logger', () => {
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    // Spy on console.error (stdio logger uses stderr)
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should log info messages to stderr', () => {
    logger.info('Test info message');

    expect(consoleErrorSpy).toHaveBeenCalledWith('[INFO]', 'Test info message');
  });

  it('should log error messages to stderr', () => {
    logger.error('Test error message');

    expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'Test error message');
  });

  it('should log warning messages to stderr', () => {
    logger.warn('Test warning message');

    expect(consoleErrorSpy).toHaveBeenCalledWith('[WARN]', 'Test warning message');
  });

  it('should handle multiple arguments', () => {
    logger.info('Message', { foo: 'bar' }, 123, true);

    expect(consoleErrorSpy).toHaveBeenCalledWith('[INFO]', 'Message', { foo: 'bar' }, 123, true);
  });

  it('should handle objects and errors', () => {
    const error = new Error('Test error');

    logger.error('Error occurred:', error);

    expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', 'Error occurred:', error);
  });

  it('should use stderr to avoid interfering with stdout protocol', () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    logger.info('Test message');
    logger.error('Test error');
    logger.warn('Test warning');

    // Verify console.log (stdout) was NEVER called
    expect(consoleLogSpy).not.toHaveBeenCalled();
    // Verify console.error (stderr) WAS called
    expect(consoleErrorSpy).toHaveBeenCalledTimes(3);

    consoleLogSpy.mockRestore();
  });

  it('should have all logger methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });
});
