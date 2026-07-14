/**
 * Rejects if `promise` does not settle within `ms`. Wrap Firestore/admin-SDK
 * reads with this so a hung backend call (network, gRPC deadlock, cold start)
 * surfaces as a caught error - and the caller's try/catch returns its safe
 * fallback - instead of a request that hangs for minutes and 500s the page.
 */
export function withTimeout<T>(promise: Promise<T>, ms = 6000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`operation timed out after ${ms}ms`)),
      ms,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
