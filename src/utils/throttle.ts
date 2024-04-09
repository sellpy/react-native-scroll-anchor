interface ThrottledFunction<T extends (...args: any) => any> {
  (...args: Parameters<T>): ReturnType<T>;
}
export const throttle = <T extends (...args: any) => ReturnType<T>>(
  fn: T,
  wait: number
): ThrottledFunction<T> => {
  let inThrottle = false;
  let lastResult: ReturnType<T>;
  let lastArgs: Parameters<T> | null;

  return function (this: ThisType<unknown>, ...args: Parameters<T>) {
    if (inThrottle) {
      lastArgs = args;
      return lastResult;
    }

    inThrottle = true;
    lastResult = fn.apply(this, args);
    setTimeout(() => {
      inThrottle = false;
      if (lastArgs) {
        lastArgs = null;
      }
    }, wait);

    return lastResult as ReturnType<T>;
  };
};
