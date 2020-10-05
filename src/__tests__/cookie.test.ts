import { expect } from 'chai';
import { stub } from 'sinon';
import CookieConsent from '../cookie';

describe('cookieConsent', () => {
  const setup = () => {
    const mappings = {
      0: 'default',
      c3: 'advertising',
      c2: 'analytics',
      c4: 'support',
    };
    const cookies = {
      example: '0:1|c1:0|c2:1|c3:0|c4:0',
      get: () => cookies.example,
      set: stub().callsFake((k, v) => {
        cookies.example = v;
      }),
    };
    const window = {
      utag: {
        cfg: {
          domain: 'dev.localhost.com',
        },
      },
      location: {
        hostname: 'he.dev.localhost.com',
      },
    };
    const consent = new CookieConsent(mappings);
    consent.cookies = cookies;
    consent.window = window;

    return {
      mappings,
      cookies,
      window,
      consent,
    };
  };

  it('can be instantiated with no mappings', () => {
    expect(() => {
      new CookieConsent();
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
    it('omits non-requested categories', () => {
      const { consent } = setup();
      const result = consent.get([ 'advertising' ]);

      expect(Object.keys(result)).to.deep.equal([ 'advertising' ]);
    });
    it('returns all categories', () => {
      const { consent } = setup();
      const result = consent.get();

      expect(result['default']).to.equal(false);
      expect(result['advertising']).to.equal(true);
      expect(result['analytics']).to.equal(false);
      expect(result['support']).to.equal(true);
    });
  });

  describe('set', () => {
    it('stores the new values', () => {
      const { consent, cookies } = setup();
      const expected = '0:0|c2:0|c3:0|c4:1';

      consent.set({
        default: true,
        advertising: true,
        analytics: true,
      });

      const actual = cookies.example;

      expect(actual).to.equal(expected);
    });
    it('preserves existing values', () => {
      const { consent, cookies } = setup();
      const expected = '0:1|c2:1|c3:0|c4:1';

      consent.set({
        advertising: true,
      });

      const actual = cookies.example;

      expect(actual).to.equal(expected);
    });
    it('ignores invalid categories', () => {
      const { consent, cookies } = setup();
      const expected = '0:1|c2:1|c3:1|c4:1';

      consent.set({
        extra: true,
      });

      const actual = cookies.example;

      expect(actual).to.equal(expected);
    });
    it('sets the domain name', () => {
      const { consent, cookies } = setup();

      consent.set({
        default: true,
        advertising: true,
        analytics: true,
      });
      
      expect(cookies.set.called).to.be.true;
      expect(cookies.set.lastCall.args[2].domain).to.equal('dev.localhost.com');
    });
  });

  describe('getByOrder', () => {
    it('contains the id and value for each category', () => {
      const { consent } = setup();

      const result = consent.getByOrder([ 'consent', 'advertising', 'analytics' ]);

      expect(result.consent.id).to.equal('0');
      expect(result.consent.value).to.equal(false);
      expect(result.advertising.id).to.equal('c2');
      expect(result.advertising.value).to.equal(false);
      expect(result.analytics.id).to.equal('c3');
      expect(result.analytics.value).to.equal(true);
    });
    it('inserts a default key', () => {
      const { consent } = setup();

      const result = consent.getByOrder([ 'consent', 'support', 'analytics', 'advertising' ]);

      expect(result.default.id).to.equal('c1');
      expect(result.default.value).to.equal(true);
    });
    it('does not insert default key if already exists', () => {
      const { consent } = setup();

      const result = consent.getByOrder([ 'consent', 'support', 'analytics', 'default', 'advertising' ]);

      expect(result.default.id).to.equal('c3');
      expect(result.default.value).to.equal(true);
    });
    it('returns void for unknown/missing categories', () => {
      const { consent } = setup();
      const result = consent.getByOrder([ 'consent', 'support', 'analytics', 'advertising', 'extra' ]);

      expect(result.extra).to.equal(void 0);
    });
    it('gets the order from the consent numbers', () => {
      const { consent, cookies } = setup();
      cookies.example = '0:1|c4:0|c2:0|c3:1|c1:0';
      const result = consent.getByOrder([ 'consent', 'support', 'analytics', 'advertising' ]);
      
      expect(result.consent.value).to.equal(false);
      expect(result.support.value).to.equal(true);
      expect(result.analytics.value).to.equal(false);
      expect(result.advertising.value).to.equal(true);
    });
  });
});
