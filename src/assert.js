class AssertionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AssertionError';
  }
}

export function ok(value, message) {
  if (!value) {
    throw new AssertionError(message || 'Assertion failed: value is not truthy');
  }
}

export function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new AssertionError(message || `Assertion failed: ${actual} !== ${expected}`);
  }
}

export function deepStrictEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual, null, 2);
  const expectedStr = JSON.stringify(expected, null, 2);

  if (actualStr !== expectedStr) {
    throw new AssertionError(
      message || `Assertion failed: objects not deeply equal\nActual: ${actualStr}\nExpected: ${expectedStr}`
    );
  }
}

export function throws(fn, errorType, message) {
  let didThrow = false;
  try {
    fn();
  } catch (error) {
    didThrow = true;
    if (errorType && !(error instanceof errorType)) {
      throw new AssertionError(
        `Expected error type ${errorType.name} but got ${error.constructor.name}`
      );
    }
  }

  if (!didThrow) {
    throw new AssertionError(message || 'Expected function to throw but it did not');
  }
}

export function fail(message) {
  throw new AssertionError(message || 'Assertion failed: explicit failure');
}

export default { ok, strictEqual, deepStrictEqual, throws, fail };