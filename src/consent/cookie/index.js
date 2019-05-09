// @flow
import typeof Cookies from 'browser-cookies';

import Maybe from 'folktale/maybe';
import * as r from 'ramda';

import consent from '../consent';
import { CONSENT_COOKIE } from '../../constants';
import { getDomain } from './utils';
import {
  monadMap,
  monadTap,
} from '../../utils';

type Categories = {
  [category: string]: boolean,
};

type CookieConsent = (
  mappings?: {
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
  getByOrder: (
    categories: Array<string>,
  ) => Maybe<{
    [key: string]: {
      id: string,
      value: boolean,
    },
  }>,
};

const cookieConsent = (
  cookies: Cookies,
  hostname: string,
): CookieConsent => (
  mappings = {},
  cookieOptions,
) => {
  const o = consent(mappings);

  const getFromCookie = () => Maybe.fromNullable(cookies.get(CONSENT_COOKIE));
  const writeToCookie = (value) => {
    const domain = getDomain(hostname);
    const opts = Object.assign(
      { domain },
      cookieOptions,
    );
    cookies.set(CONSENT_COOKIE, value, opts);
  };

  const get = (categories) => r.pipe(
    getFromCookie,
    monadMap((consent) => o.get(categories, consent)),
  )(null);
  const set = (categories) => r.pipe(
    getFromCookie,
    monadMap((consent) => o.set(categories, consent)),
    monadTap(writeToCookie),
  )(null);
  const getByOrder = (categories) => r.pipe(
    getFromCookie,
    monadMap((consent) => o.getByOrder(categories, consent)),
  )(null);

  return {
    get,
    set,
    getByOrder,
  };
};

export default cookieConsent;
