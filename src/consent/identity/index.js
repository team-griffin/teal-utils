// @flow

import consent from '../consent';

type Categories = {
  [category: string]: boolean,
};

type Consent = (
  mappings?: {
    [id: string]: string,
  },
  consent: string,
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

const identityConsent: Consent = (
  mappings,
  consentStr,
) => {
  let str = consentStr;
  const o = consent(mappings);

  const get = (categories) => o.get(categories, str);
  const set = (categories) => {
    str = o.set(categories, str);
    return str;
  };
  const getByOrder = (categories) => o.getByOrder(categories, str);

  return {
    get,
    set,
    getByOrder,
  };
};

export default identityConsent;
