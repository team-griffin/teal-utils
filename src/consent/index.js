// @flow
import cookies from 'browser-cookies';

import consent from './consent';
import createCookie from './cookie';

const cookieConsent = createCookie(cookies);

export {
  consent,
  cookieConsent,
};
