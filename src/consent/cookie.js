// @flow
import typeof Cookies from 'browser-cookies';

import Maybe from 'folktale/maybe';
import * as r from 'ramda';

import consent from './consent';
import { CONSENT_COOKIE } from '../constants';
import {
  monadMap,
  monadTap,
} from '../utils';

type Categories = {
  [category: string]: boolean,
};

type CookieConsent = (
  mappings: {
    [id: string]: string,
  },
  cookieOptions?: Object,
) => {
  get: (
    categories?: Array<string>,
  ) => Maybe<Categories>,
  set: (
    categories: Categories,
  ) => Maybe<string>,
};

const cookieConsent = (
  cookies: Cookies,
): CookieConsent => (
  mappings,
  cookieOptions,
) => {
  const o = consent(mappings);

  const getFromCookie = () => Maybe.fromNullable(cookies.get(CONSENT_COOKIE));
  const writeToCookie = (value) => {
    cookies.set(CONSENT_COOKIE, value, cookieOptions);
  };

  const get = (categories) => {
    return r.pipe(
      getFromCookie,
      monadMap((consent) => o.get(categories, consent)),
    )(null);
  };
  const set = (categories) => {
    return r.pipe(
      getFromCookie,
      monadMap((consent) => o.set(categories, consent)),
      monadTap(writeToCookie),
    )(null);
  };

  return {
    get,
    set,
  };
};

export default cookieConsent;
