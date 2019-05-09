// @flow
import * as r from 'ramda';

import parse from './parse';

type Categories = Array<string>;

const getByOrder = (
  consent: string,
  categories: Categories,
) => {
  const parsed = parse(consent);
  const i = r.findIndex((category) => category.id === 'c1', parsed);
  const categoriesWithDefault = r.when(
    r.both(
      r.always(i >= 0),
      r.complement(r.contains('default')),
    ),
    r.insert(i, 'default'),
  )(categories);

  return r.zipObj(categoriesWithDefault, parsed);
};

export default getByOrder;
