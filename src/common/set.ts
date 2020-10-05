import { aliasesToIds } from './map';
import get from './get';
import { Mappings } from '../types';

const set = (
  mappings: Mappings,
  consent: string,
  categories: {
    [key: string]: boolean,
  },
) => {
  const idCategories = aliasesToIds(categories, mappings);
  const previous = get(mappings, consent);
  const previousIdCategories = aliasesToIds(previous, mappings);
  const str = Object
    .keys(previousIdCategories)
    .map((id) => {
      const category = idCategories[id];
      const flag = category ? 0 : 1;
      return `${id}:${flag}`;
    })
    .join('|');

  return str;
};

export default set;
