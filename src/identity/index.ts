import * as common from '../common';
import { Mappings } from '../types';

class Identity {
  mappings: Mappings;
  consent: string;

  constructor(mappings?: Mappings, consent?: string) {
    this.mappings = mappings ?? {};
    this.consent = consent ?? '';
  }

  get(categories?: string[]) {
    return common.get(this.mappings, this.consent, categories);
  }
  set(categories: { [key: string]: boolean }) {
    this.consent = common.set(this.mappings, this.consent, categories);
    return this.consent;
  }
  getByOrder(categories: string[]) {
    return common.getByOrder(this.consent, categories);
  }
}

export default Identity;
