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

  const parseConsent = r.pipe(
    r.split('|'),
    r.map(parseCategory),
  );

  return parseConsent(consent);
};

export default parse;
