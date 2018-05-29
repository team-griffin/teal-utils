// @flow
import * as r from 'ramda';

export const curry2 = r.curryN(2);
export const curry3 = r.curryN(3);

export const monadMap = r.map;
export const monadTap = curry2((fn, monad) => monadMap((x) => {
  fn(x);
  return x;
}, monad));

export const getOrElse = r.invoker(1, 'getOrElse');
