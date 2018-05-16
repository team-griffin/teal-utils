// @flow
import * as r from 'ramda';
import Maybe from 'folktale/maybe';

import {
  monadMap,
  getOrElse,
} from '../utils';
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

  const parseCategory = r.pipe(
    Maybe.fromNullable,
    monadMap(
      r.pipe(
        r.split(':'),
        r.zipObj([ 'id', 'value' ]),
        r.ifElse(
          r.propEq('value', '0'),
          r.assoc('value', true),
          r.assoc('value', false),
        ),
        ({
          id,
          value,
        }) => ({ [id]: value }),
      ),
    ),
    // $FlowFixMe
    getOrElse({}),
  );

  const parseConsent = r.pipe(
    r.split('|'),
    r.map(parseCategory),
    r.prepend(defaultOptOuts),
    r.mergeAll,
    r.unless(
      r.always(r.isNil(categories)),
      r.pickAll(ids),
    ),
  );

  const getOptOuts = r.pipe(
    r.always(consent),
    parseConsent,
    idsToAliases(r.__, mappings),
  );

  return getOptOuts(null);
};

export default get;
