import { expect } from 'chai';
import Identity from '../identity';

describe('consent', () => {
  const setup = () => {
    const mappings = {
      0: 'default',
      c: 'advertising',
      c9: 'analytics',
      c11: 'support',
    };
    const example = '0:1|c:0|c9:1|c11:0';
    const identity = new Identity(mappings, example);

    return {
      mappings,
      example,
      identity,
      consent: identity,
    };
  };

  it('can be instantiated with no mappings', () => {
    expect(() => {
      new Identity();
    }).not.to.throw;
  });
  
  describe('get', () => {
    it('returns the id and value for each category', () => {
      const { consent } = setup();

      const result = consent.get([ 'default', 'advertising', 'analytics' ]);

      expect(result['default']).to.equal(false);
      expect(result['advertising']).to.equal(true);
      expect(result['analytics']).to.equal(false);
    });
    it('returns void for unknown/missing categories', () => {
      const { consent } = setup();
      const result = consent.get([ 'default', 'support', 'extra' ]);

      expect(result.extra).to.equal(void 0);
    });
    it('omits non-requetsed categories', () => {
      const { consent } = setup();
      const result = consent.get([ 'advertising' ]);

      expect(Object.keys(result)).to.deep.equal([ 'advertising' ]);
    });
    it('returns all categories', () => {
      const { consent } = setup();
      const result = consent.get(void 0);

      expect(result['default']).to.equal(false);
      expect(result['advertising']).to.equal(true);
      expect(result['analytics']).to.equal(false);
      expect(result['support']).to.equal(true);
    });
  });

  describe('set', () => {
    it('stores the new values', () => {
      const { consent } = setup();
      const expected = '0:0|c:0|c9:0|c11:1';

      const actual = consent.set({
        default: true,
        advertising: true,
        analytics: true,
      });

      expect(actual).to.equal(expected);
    });
    it('preserves existing values', () => {
      const { consent } = setup();
      const expected = '0:1|c:0|c9:1|c11:1';

      const actual = consent.set({
        advertising: true,
      });

      expect(actual).to.equal(expected);
    });
    it('ignores invalid categories', () => {
      const { consent } = setup();
      const expected = '0:1|c:1|c9:1|c11:1';

      const actual = consent.set({
        extra: true,
      });

      expect(actual).to.equal(expected);
    });
  });

  describe('getByOrder', () => {
    it('contains the provided keys', () => {
      const { consent } = setup();
      const result = consent.getByOrder([ 'default', 'analytics' ]);
      expect(result.default).to.be.instanceof(Object);
      expect(result.analytics).to.be.instanceof(Object);
    });
    it('contains the id and value for each category', () => {
      const { consent } = setup();

      const result = consent.getByOrder([ 'default', 'advertising', 'analytics' ]);

      expect(result.default.id).to.equal('0');
      expect(result.default.value).to.equal(false);
      expect(result.advertising.id).to.equal('c');
      expect(result.advertising.value).to.equal(true);
      expect(result.analytics.id).to.equal('c9');
      expect(result.analytics.value).to.equal(false);
    });
    it('returns void for unknown/missing categories', () => {
      const { consent } = setup();
      const result = consent.getByOrder([ 'default', 'support', 'analytics', 'advertising', 'extra' ]);

      expect(result.extra).to.equal(void 0);
    });
  })
})
