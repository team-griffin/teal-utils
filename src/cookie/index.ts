import cookies from 'browser-cookies';
import * as common from '../common';
import { CONSENT_COOKIE } from '../constants';
import { Mappings } from '../types';
import { getDomain } from './utils';

type Cookies = typeof cookies;

class CookieConsent {
  mappings: Mappings;
  cookieOptions: any;
  window: Window;
  cookies: Cookies;

  constructor(mappings?: Mappings, cookieOptions?: any) {
    this.mappings = mappings ?? {};
    this.cookieOptions = cookieOptions;
    this.window = window;
    this.cookies = cookies;
  }
  get(categories?: string[]) {
    return common.get(
      this.mappings,
      this.cookies.get(CONSENT_COOKIE),
      categories,
    );
  }
  set(categories: { [key: string]: boolean }) {
    const result = common.set(
      this.mappings,
      this.cookies.get(CONSENT_COOKIE),
      categories,
    );
    this.cookies.set(CONSENT_COOKIE, result, {
      domain: getDomain(this.window),
      ...this.cookieOptions,
    });
    return result;
  }
  getByOrder(categories: string[]) {
    return common.getByOrder(
      this.cookies.get(CONSENT_COOKIE),
      categories,
    );
  }
}

export default CookieConsent;
