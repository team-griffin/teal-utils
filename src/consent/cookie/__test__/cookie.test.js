import { expect } from 'chai';
import sinon from 'sinon';

import consent from '../';

describe('cookieConsent', function(){
  beforeEach(function(){
    const mappings = this.mappings = {
      0: 'default',
      c3: 'advertising',
      c2: 'analytics',
      c4: 'support',
    };
    const cookies = this.cookies = {
      example: '0:1|c1:0|c2:1|c3:0|c4:0',
      get: () => cookies.example,
      set: sinon.stub().callsFake((k, v) => {
        cookies.example = v;
      }),
    };
    const window = this.window = {
      utag: {
        cfg: {
          domain: 'dev.localhost.com',
        },
      },
      location: {
        hostname: 'he.dev.localhost.com',
      },
    };
    this.consent = consent(cookies, window)(mappings);
  });

  it('can be instantiated with no mappings', function () {
    expect(() => {
      consent();
    }).not.to.throw;
  });
  it('has a get method', function(){
    expect(typeof this.consent.get).to.equal('function');
  });
  it('has a set method', function () {
    expect(typeof this.consent.set).to.equal('function');
  });
  it('has a getByOrder method', function () {
    expect(typeof this.consent.getByOrder).to.equal('function');
  });

  describe('get', function(){
    it('returns an object', function () {
      const { consent } = this;
      const result = consent.get([ 'default' ]);
      expect(result).to.be.instanceof(Object);
    });
    it('returns the id and value for each category', function () {
      const { consent } = this;

      const result = consent.get([ 'default', 'advertising', 'analytics' ]);

      expect(result['default']).to.equal(false);
      expect(result['advertising']).to.equal(true);
      expect(result['analytics']).to.equal(false);
    });
    it('returns void for unknown/missing categories', function () {
      const { consent } = this;
      const result = consent.get([ 'default', 'support', 'extra' ]);

      expect(result.extra).to.equal(void 0);
    });
    it('omits non-requested categories', function () {
      const { consent } = this;
      const result = consent.get([ 'advertising' ]);

      expect(Object.keys(result)).to.deep.equal([ 'advertising' ]);
    });
    it('returns all categories', function () {
      const { consent } = this;
      const result = consent.get();

      expect(result['default']).to.equal(false);
      expect(result['advertising']).to.equal(true);
      expect(result['analytics']).to.equal(false);
      expect(result['support']).to.equal(true);
    });
  });

  describe('set', function(){
    it('stores the new values', function () {
      const expected = '0:0|c2:0|c3:0|c4:1';

      this.consent.set({
        default: true,
        advertising: true,
        analytics: true,
      });

      const actual = this.cookies.example;

      expect(actual).to.equal(expected);
    });
    it('preserves existing values', function () {
      const expected = '0:1|c2:1|c3:0|c4:1';

      this.consent.set({
        advertising: true,
      });

      const actual = this.cookies.example;

      expect(actual).to.equal(expected);
    });
    it('ignores invalid categories', async function () {
      const expected = '0:1|c2:1|c3:1|c4:1';

      this.consent.set({
        extra: true,
      });

      const actual = this.cookies.example;

      expect(actual).to.equal(expected);
    });
    it('sets the domain name', function() {
      this.consent.set({
        default: true,
        advertising: true,
        analytics: true,
      });
      
      expect(this.cookies.set.called).to.be.true;
      expect(this.cookies.set.lastCall.args[2].domain).to.equal('dev.localhost.com');
    });
  });

  describe('getByOrder', function(){
    it('returns an object', function () {
      const { consent } = this;
      const result = consent.getByOrder([ 'consent' ]);
      expect(result).to.be.instanceof(Object);
    });
    it('contains the provided keys', function () {
      const { consent } = this;
      const result = consent.getByOrder([ 'consent', 'analytics' ]);
      expect(result.consent).to.be.instanceof(Object);
      expect(result.analytics).to.be.instanceof(Object);
    });
    it('contains the id and value for each category', function () {
      const { consent } = this;

      const result = consent.getByOrder([ 'consent', 'advertising', 'analytics' ]);

      expect(result.consent.id).to.equal('0');
      expect(result.consent.value).to.equal(false);
      expect(result.advertising.id).to.equal('c2');
      expect(result.advertising.value).to.equal(false);
      expect(result.analytics.id).to.equal('c3');
      expect(result.analytics.value).to.equal(true);
    });
    it('inserts a default key', function() {
      const { consent } = this;

      const result = consent.getByOrder([ 'consent', 'support', 'analytics', 'advertising' ]);

      expect(result.default.id).to.equal('c1');
      expect(result.default.value).to.equal(true);
    });
    it('does not insert default key if already exists', function() {
      const { consent } = this;

      const result = consent.getByOrder([ 'consent', 'support', 'analytics', 'default', 'advertising' ]);

      expect(result.default.id).to.equal('c3');
      expect(result.default.value).to.equal(true);
    });
    it('returns void for unknown/missing categories', function () {
      const { consent } = this;
      const result = consent.getByOrder([ 'consent', 'support', 'analytics', 'advertising', 'extra' ]);

      expect(result.extra).to.equal(void 0);
    });
    it('gets the order from the consent numbers', function() {
      const { consent } = this;
      this.cookies.example = '0:1|c4:0|c2:0|c3:1|c1:0';
      const result = consent.getByOrder([ 'consent', 'support', 'analytics', 'advertising' ]);
      
      expect(result.consent.value).to.equal(false);
      expect(result.support.value).to.equal(true);
      expect(result.analytics.value).to.equal(false);
      expect(result.advertising.value).to.equal(true);
    });
  });
});
