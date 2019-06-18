// @flow
import typeof Cookies from 'browser-cookies';

import * as r from 'ramda';

import consent from '../consent';
import { CONSENT_COOKIE } from '../../constants';
import { getDomain } from './utils';

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
  ) => Categories,
  set: (
    categories: Categories,
  ) => string,
  getByOrder: (
    categories: Array<string>,
  ) => {
    [key: string]: {
      id: string,
      value: boolean,
    },
  },
};

const cookieConsent = (
  cookies: Cookies,
  window: Object,
): CookieConsent => (
  mappings = {},
  cookieOptions,
) => {
  const o = consent(mappings);

  const getFromCookie = () => cookies.get(CONSENT_COOKIE);
  const writeToCookie = (value) => {
    const domain = getDomain(window);
    const opts = Object.assign(
      { domain },
      cookieOptions,
    );
    cookies.set(CONSENT_COOKIE, value, opts);
  };

  const get = (categories) => r.pipe(
    getFromCookie,
    (consent) => o.get(categories, consent),
  )(null);
  const set = (categories) => r.pipe(
    getFromCookie,
    (consent) => o.set(categories, consent),
    r.tap(writeToCookie),
  )(null);
  const getByOrder = (categories) => r.pipe(
    getFromCookie,
    (consent) => o.getByOrder(categories, consent),
  )(null);

  return {
    get,
    set,
    getByOrder,
  };
};

export default cookieConsent;
