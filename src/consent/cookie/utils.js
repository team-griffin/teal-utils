// @flow
import * as r from 'ramda';

export const getDomain = r.converge(
  r.defaultTo,
  [
    r.path([ 'location', 'hostname' ]),
    r.path([ 'utag', 'cfg', 'domain' ]),
  ],
);
