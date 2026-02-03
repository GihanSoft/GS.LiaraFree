import type { ProblemDetails } from "./problem-details";

/**
 * Represents the outcome of an operation that can either succeed or fail.
 *
 * @template T - The type of the successful result.
 * @template E - The type of the error (defaults to `ProblemDetails`).
 */
export type Result<T = undefined, E = ProblemDetails> = Success<T> | Failure<E>;

/**
 * Represents a successful operation.
 */
export interface Success<T> {
  readonly _tag: "Success";
  readonly value: T;
}

/**
 * Represents a failed operation.
 */
export interface Failure<E> {
  readonly _tag: "Failure";
  readonly error: E;
}

/**
 * Creates a successful result.
 */
export function success<T>(value: T): Success<T> {
  return { _tag: "Success", value };
}

/**
 * Creates a failed result.
 */
export function failure<E>(error: E): Failure<E> {
  return { _tag: "Failure", error };
}

/**
 * Checks if the result is a success.
 */
export function isSuccess<T, E>(result: Result<T, E>): result is Success<T> {
  return result._tag === "Success";
}

/**
 * Checks if the result is a failure.
 */
export function isFailure<T, E>(result: Result<T, E>): result is Failure<E> {
  return result._tag === "Failure";
}

/**
 * Extracts the value if the result is a success, otherwise throws.
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (isFailure(result)) {
    throw new Error(
      `Cannot unwrap a failed result: ${JSON.stringify(result.error)}`
    );
  }
  return result.value;
}

/**
 * Extracts the value if the result is a success, otherwise returns a default value.
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return isSuccess(result) ? result.value : defaultValue;
}

/**
 * Maps the success value to another type.
 */
export function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  return isSuccess(result) ? success(fn(result.value)) : failure(result.error);
}

/**
 * Maps the error to another type.
 */
export function mapError<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> {
  return isSuccess(result) ? success(result.value) : failure(fn(result.error));
}

/**
 * Chains another operation if the result is a success.
 */
export function andThen<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  return isSuccess(result) ? fn(result.value) : failure(result.error);
}

/**
 * Chains another operation if the result is a failure.
 */
export function orElse<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => Result<T, F>
): Result<T, F> {
  return isSuccess(result) ? success(result.value) : fn(result.error);
}

/**
 * Combines two results into a single result.
 */
export function combine<T1, T2, E1, E2>(
  result1: Result<T1, E1>,
  result2: Result<T2, E2>
): Result<[T1, T2], E1 | E2> {
  return isFailure(result1)
    ? failure(result1.error)
    : isFailure(result2)
    ? failure(result2.error)
    : success([result1.value, result2.value]);
}
