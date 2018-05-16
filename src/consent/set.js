// @flow
import * as r from 'ramda';

import {
  aliasesToIds,
} from './map';
import get from './get';

type Categories = {
  [id: string]: boolean,
};

const set = (
  mappings: Object,
  consent: string,
  categories: Categories,
) => {
  const idCategories = aliasesToIds(categories, mappings);

  const formatCategories = r.pipe(
    aliasesToIds(r.__, mappings),
    r.mapObjIndexed(
      (category, id) => r.pipe(
        r.prop(id),
        r.ifElse(
          r.equals(true),
          r.always(0),
          r.always(1),
        ),
        (value) => `${id}:${value}`,
      )(idCategories),
    ),
    r.values,
    r.join('|'),
  );

  return r.pipe(
    get,
    formatCategories,
  )(mappings, consent);
};

export default set;
