// @flow
import * as r from 'ramda';
import Maybe from 'folktale/maybe';

import {
  monadMap,
  getOrElse,
} from '../utils';

const parse = (
  consent: string,
) => {
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
      ),
    ),
    // $FlowFixMe
    getOrElse({}),
  );

  const parseConsent = r.pipe(
    r.split('|'),
    r.map(parseCategory),
  );

  return parseConsent(consent);
};

export default parse;
