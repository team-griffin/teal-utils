import { expect } from 'chai';
import sinon from 'sinon';
import { identity } from 'ramda';

import consent from '../';

describe('consent', function(){
  beforeEach(function(){
    const mappings = this.mappings = {
      0: 'default',
      c: 'advertising',
      c9: 'analytics',
      c11: 'support',
    };
    const example = this.example = '0:1|c:0|c9:1|c11:0';
    this.consent = consent(mappings);
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
      const { consent, example } = this;
      const result = consent.get([ 'default' ], example);
      expect(result).to.be.instanceof(Object);
    });
    it('returns the id and value for each category', function () {
      const { consent, example } = this;

      const result = consent.get([ 'default', 'advertising', 'analytics' ], example);

      expect(result['default']).to.equal(false);
      expect(result['advertising']).to.equal(true);
      expect(result['analytics']).to.equal(false);
    });
    it('returns void for unknown/missing categories', function () {
      const { consent, example } = this;
      const result = consent.get([ 'default', 'support', 'extra' ], example);

      expect(result.extra).to.equal(void 0);
    });
    it('omits non-requested categories', function () {
      const { consent, example } = this;
      const result = consent.get([ 'advertising' ], example);

      expect(Object.keys(result)).to.deep.equal([ 'advertising' ]);
    });
    it('returns all categories', function () {
      const { consent, example } = this;
      const result = consent.get(void 0, example);

      expect(result['default']).to.equal(false);
      expect(result['advertising']).to.equal(true);
      expect(result['analytics']).to.equal(false);
      expect(result['support']).to.equal(true);
    });
  });

  describe('set', function(){
    it('stores the new values', function () {
      const expected = '0:0|c:0|c9:0|c11:1';

      const actual = this.consent.set({
        default: true,
        advertising: true,
        analytics: true,
      }, this.example);

      expect(actual).to.equal(expected);
    });
    it('preserves existing values', function () {
      const expected = '0:1|c:0|c9:1|c11:1';

      const actual = this.consent.set({
        advertising: true,
      }, this.example);

      expect(actual).to.equal(expected);
    });
    it('ignores invalid categories', async function () {
      const expected = '0:1|c:1|c9:1|c11:1';

      const actual = this.consent.set({
        extra: true,
      }, this.example);

      expect(actual).to.equal(expected);
    });
  });

  describe('getByOrder', function(){
    it('returns an object', function () {
      const { consent, example } = this;
      const result = consent.getByOrder([ 'default' ], example);
      expect(result).to.be.instanceof(Object);
    });
    it('contains the provided keys', function () {
      const { consent, example } = this;
      const result = consent.getByOrder([ 'default', 'analytics' ], example);
      expect(result.default).to.be.instanceof(Object);
      expect(result.analytics).to.be.instanceof(Object);
    });
    it('contains the id and value for each category', function () {
      const { consent, example } = this;

      const result = consent.getByOrder([ 'default', 'advertising', 'analytics' ], example);

      expect(result.default.id).to.equal('0');
      expect(result.default.value).to.equal(false);
      expect(result.advertising.id).to.equal('c');
      expect(result.advertising.value).to.equal(true);
      expect(result.analytics.id).to.equal('c9');
      expect(result.analytics.value).to.equal(false);
    });
    it('returns void for unknown/missing categories', function () {
      const { consent, example } = this;
      const result = consent.getByOrder([ 'default', 'support', 'analytics', 'advertising', 'extra' ], example);

      expect(result.extra).to.equal(void 0);
    });
  });

});
