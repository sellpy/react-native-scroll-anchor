export const debounce = <T extends (...args: any) => any>(
  fn: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return function (this: ThisType<unknown>, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
};
