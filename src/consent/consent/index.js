// @flow
import _get from '../get';
import _set from '../set';
import _getByOrder from '../getByOrder';

type Categories = {
  [category: string]: boolean,
};

type Consent = (
  mappings?: {
    [id: string]: string,
  },
) => {
  get: (
    categories?: Array<string>,
    consent: string,
  ) => Categories,
  set: (
    categories: Categories,
    consent: string,
  ) => string,
  getByOrder: (
    categories: Array<string>,
    consent: string,
  ) => {
    [key: string]: {
      id: string,
      value: boolean,
    },
  },
};

const consent: Consent = (mappings = {}) => {
  const get = (categories, consent) => _get(mappings, consent, categories);
  const set = (categories, consent) => _set(mappings, consent, categories);
  const getByOrder = (categories, consent) => _getByOrder(consent, categories);

  return {
    get,
    set,
    getByOrder,
  };
};

export default consent;
