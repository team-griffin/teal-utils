import * as common from '../common';
import { Mappings } from '../types';

class Consent {
  mappings: Mappings;

  constructor(mappings?: Mappings) {
    this.mappings = mappings ?? {};
  }

  get(
    categories: string[],
    consent: string,
  ) {
    return common.get(this.mappings, consent, categories);
  }

  set(
    categories: {
      [key: string]: boolean,
    },
    consent: string,
  ) {
    return common.set(this.mappings, consent, categories);
  }

  getByOrder(
    categories: string[],
    consent: string,
  ) {
    return common.getByOrder(consent, categories);
  }
}

export default Consent;
