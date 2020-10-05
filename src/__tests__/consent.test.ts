import { expect } from 'chai';
import Consent from '../consent';

describe('Consent', () => {
  const setup = () => {
    const mappings = {
      0: 'default',
      c: 'advertising',
      c9: 'analytics',
      c11: 'support',
    };
    const example = '0:1|c:0|c9:1|c11:0';
    const consent = new Consent(mappings);

    return {
      mappings,
      example,
      consent,
    };
  };

  it('can be instantiated with no mappings', () => {
    expect(() => new Consent()).not.to.throw();
  });

  describe('get', () => {
    it('returns an object', () => {
      const { consent, example } = setup();
      const result = consent.get([ 'default' ], example);
      expect(result).to.be.instanceOf(Object);
    });
    it('returns the id and value for each category', () => {
      const { consent, example } = setup();

      const result = consent.get([ 'default', 'advertising', 'analytics' ], example);

      expect(result.default).to.be.false;
      expect(result.advertising).to.be.true;
      expect(result.analytics).to.be.false;
    });
    it('returns void for unknown/missing categories', () => {
      const { consent, example } = setup();

      const result = consent.get([ 'default', 'support', 'extra' ], example);

      expect(result.extra).to.equal(void 0);
    });
    it('omits non-requested categories', () => {
      const { consent, example } = setup();

      const result = consent.get([ 'advertising' ], example);

      expect(Object.keys(result)).to.deep.equal([ 'advertising' ]);
    });
    it('returns all categories', () => {
      const { consent, example } = setup();

      const result = consent.get(void 0, example);

      expect(result.default).to.be.false;
      expect(result.advertising).to.be.true;
      expect(result.analytics).to.be.false;
      expect(result.support).to.be.true;
    });
  });

  describe('set', () => {
    it('stores the new values', () => {
      const { consent, example } = setup();

      const expected = '0:0|c:0|c9:0|c11:1';

      const actual = consent.set({
        default: true,
        advertising: true,
        analytics: true,
      }, example);

      expect(actual).to.equal(expected);
    });
    it('preserves existing values', () => {
      const { consent, example } = setup();
      const expected = '0:1|c:0|c9:1|c11:1';

      const actual = consent.set({
        advertising: true,
      }, example);

      expect(actual).to.equal(expected);
    });
    it('ignores invalid categories', () => {
      const { consent, example } = setup();
      const expected = '0:1|c:1|c9:1|c11:1';

      const actual = consent.set({
        extra: true,
      }, example);

      expect(actual).to.equal(expected);
    });
  });

  describe('getByOrder', () => {
    it('contains the provided keys', () => {
      const { consent, example } = setup();
      
      const result = consent.getByOrder([ 'default', 'analytics' ], example);

      expect(result.default).not.to.be.undefined;
      expect(result.analytics).not.to.be.undefined;
    });
    it('contains the id and value for each category', () => {
      const { consent, example } = setup();

      const result = consent.getByOrder([ 'default', 'advertising', 'analytics' ], example);

      expect(result).to.deep.equal({
        default: {
          id: '0',
          value: false,
        },
        advertising: {
          id: 'c',
          value: true,
        },
        analytics: {
          id: 'c9',
          value: false,
        },
      });
    });
    it('returns void for unknown/missing categories', () => {
      const { consent, example } = setup();
      
      const result = consent.getByOrder([ 'default', 'support', 'advertising', 'analytics', 'extra' ], example);

      expect(result.extra).to.be.undefined;
    });
  });
});
