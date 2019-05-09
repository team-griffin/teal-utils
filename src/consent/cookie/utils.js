// @flow
import tlds from 'tld-list';
import * as r from 'ramda';

export const getDomain = (hostname: string) => {
  debugger
  const tld = r.pipe(
    r.map((tld) => `.${tld}`),
    r.find(r.endsWith(r.__, hostname)),
    r.when(
      r.isNil,
      r.pipe(
        r.always(hostname),
        r.split('.'),
        r.last,
      ),
    ),
  )(tlds);

  const i = r.indexOf(tld, hostname);

  return r.pipe(
    r.slice(0, i),
    r.split('.'),
    r.last,
    (url) => `${url}${tld}`,
  )(hostname);
};
