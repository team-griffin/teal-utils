import {
  Mappings,
} from '../types';
import mapEntries from '@team-griffin/capra/map-entries';
import invertObj from '@team-griffin/capra/invert-obj';
import mapObj from '@team-griffin/capra/map-obj';

export const idsToAliases = (
  ids: { [id: string]: boolean },
  mappings: Mappings,
) => {
  return mapEntries(ids ?? {}, (entries) => {
    return entries
      .filter(([ id ]) => {
        return mappings[id] != null;
      })
      .map(([ id, value ]) => {
        const alias = mappings[id];
        return [ alias, value ];
      });
  });
};

export const aliasesToIds = (
  aliases: { [alias: string]: boolean },
  mappings: Mappings,
) => {
  const iMappings = invertObj(mappings);

  return mapObj(aliases ?? {}, (alias, value) => {
    const id = iMappings[alias];
    return [ id, value ];
  });
};

export const aliasListToIdList = (
  aliases: string[],
  mappings: Mappings,
) => {
  const iMappings = invertObj(mappings);
  return aliases.map((alias) => {
    const id = iMappings[alias];
    return id;
  });
};
