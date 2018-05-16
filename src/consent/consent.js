// @flow
import _get from './get';
import _set from './set';

type Categories = {
  [category: string]: boolean,
};

type Consent = (
  mappings: {
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
};

const consent: Consent = (mappings) => {
  const get = (categories, consent) => _get(mappings, consent, categories);
  const set = (categories, consent) => _set(mappings, consent, categories);

  return {
    get,
    set,
  };
};

export default consent;
