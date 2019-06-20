// @flow
import * as r from 'ramda';

const parse = (
  consent: string,
) => {
  const parseCategory = r.pipe(
    r.pipe(
      r.split(':'),
      r.zipObj([ 'id', 'value' ]),
      r.ifElse(
        r.propEq('value', '0'),
        r.assoc('value', true),
        r.assoc('value', false),
      ),
    ),
    r.defaultTo({}),
  );

  const getCategoryIndex = r.pipe(
    r.propOr('', 'id'),
    r.replace(/[a-zA-Z]/g, ''),
    Number,
  );

  const parseConsent = r.pipe(
    r.defaultTo(''),
    r.split('|'),
    r.map(parseCategory),
    r.sortBy(getCategoryIndex),
  );

  return parseConsent(consent);
};

export default parse;
