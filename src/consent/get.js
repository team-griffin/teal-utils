// @flow
import * as r from 'ramda';

import parse from './parse';
import {
  aliasListToIdList,
  idsToAliases,
} from './map';

type Categories = Array<string>;

const get = (
  mappings: Object,
  consent: string,
  categories?: Categories,
) => {
  const ids = aliasListToIdList(categories, mappings);

  const defaultOptOuts = r.pipe(
    r.defaultTo([]),
    r.map((id) => ({ [id]: false })),
    r.mergeAll,
  )(ids);

  const parseConsent = r.pipe(
    parse,
    r.map(({
      id,
      value,
    }) => ({ [id]: value })),
    r.prepend(defaultOptOuts),
    r.mergeAll,
    r.unless(
      r.always(r.isNil(categories)),
      r.pickAll(ids),
    ),
  );

  const getOptOuts = r.pipe(
    parseConsent,
    idsToAliases(r.__, mappings),
  );

  return getOptOuts(consent);
};

export default get;
