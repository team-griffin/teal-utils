// @flow
import * as r from 'ramda';

import parse from './parse';

type Categories = Array<string>;

const getByOrder = (
  consent: string,
  categories: Categories,
) => {
  return r.pipe(
    parse,
    r.zipObj(categories),
  )(consent);
};

export default getByOrder;
