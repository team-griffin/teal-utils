import { DEFAULT_CATEGORY, DEFAULT_ID } from '../constants';
import parse from './parse';
import { Category } from '../types';

const getByOrder = (
  consent: string,
  categories: string[],
): {
  [key: string]: Category,
} => {
  const parsed = parse(consent);
  // we should always have a default category
  // if one isn't passed in, we should insert it
  const i = parsed
    .map((category) => category.id)
    .indexOf(DEFAULT_ID);
  const hasDefault = categories.includes(DEFAULT_CATEGORY);

  if (i >= 0 && !hasDefault) {
    // eslint-disable-next-line no-param-reassign
    categories = categories.slice();
    categories.splice(i, 0, 'default');
  }

  return categories.reduce((acc, key, i) => {
    return {
      ...acc,
      [key]: parsed[i],
    };
  }, {});
};

export default getByOrder;
