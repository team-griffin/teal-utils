import parse from './parse';
import {
  aliasListToIdList,
  idsToAliases,
} from './map';
import { Mappings } from '../types';

const get = (
  mappings: Mappings,
  consent: string,
  categories?: string[],
) => {
  const allIds = aliasListToIdList(categories ?? [], mappings) ?? [];
  const defaultOptOuts: { [key: string]: boolean } = (allIds).reduce((acc, id) => {
    return {
      ...acc,
      [id]: false,
    };
  }, {});
  const parsed = parse(consent).reduce((acc, category) => {
    return {
      ...acc,
      [category.id]: category.value,
    };
  }, defaultOptOuts);
  let ids = parsed;
  if (categories) {
    ids = allIds.reduce((acc, id) => ({
      ...acc,
      [id]: parsed[id],
    }), {});
  }

  return idsToAliases(ids, mappings);
};

export default get;
