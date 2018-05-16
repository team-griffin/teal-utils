// @flow
import * as r from 'ramda';
import { curry2 } from '../utils';

export const idToAlias = r.prop;

export const aliasToId = curry2((
  alias: string,
  mappings: Object,
) => r.pipe(
  r.invertObj,
  r.prop(alias),
)(mappings));

export const idsToAliases = curry2((
  ids: Object,
  mappings: Object
) => r.pipe(
  r.defaultTo({}),
  r.keys,
  r.map((id) => {
    const alias = mappings[id];
    return { [alias]: ids[id] };
  }),
  r.mergeAll,
)(ids));

export const aliasesToIds = curry2((
  aliases: Object,
  mappings: Object
) => {
  const iMappings = r.invertObj(mappings);
  return r.pipe(
    r.defaultTo({}),
    r.keys,
    r.map((alias) => {
      const id = iMappings[alias];
      return { [id]: aliases[alias] };
    }),
    r.mergeAll,
  )(aliases);
});

export const idListToAliasList = curry2((
  ids: Object,
  mappings: Object
) => r.map(
  r.prop(r.__, mappings),
  r.defaultTo([], ids),
));

export const aliasListToIdList = curry2((
  aliases: Array<string>,
  mappings: Object
) => r.map(
  r.prop(r.__, r.invertObj(mappings)),
  r.defaultTo([], aliases),
));
