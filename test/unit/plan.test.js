import assert from 'assert';
import { Checkout } from '../../lib/recurly';
import { initCheckout } from './support/helpers';

describe('Checkout.plan', function () {
  const valid = 'basic';
  const invalid = 'invalid';

  beforeEach(function () {
    this.recurly = initCheckout();
  });

  it('requires a callback', function () {
    const { recurly } = this;
    assert.throws(() => recurly.plan(valid), { message: 'Missing callback' });
  });

  it('requires a plan code', function (done) {
    const { recurly } = this;
    recurly.plan(undefined, (err) => {
      assert.strictEqual(err.message, 'Missing plan code');
      done();
    });
  });

  it('requires Checkout.configure', function () {
    try {
      const recurly = new Checkout();
      recurly.plan(valid, () => {});
    } catch (e) {
      assert(~e.message.indexOf('configure'));
    }
  });

  describe('when given an invalid plan', function () {
    it('produces an error', function (done) {
      const { recurly } = this;
      recurly.plan(invalid, function (err, plan) {
        assert(err);
        assert(!plan);
        done();
      });
    });
  });

  describe('when given a valid plan', function () {
    it('yields a plan', function (done) {
      const { recurly } = this;
      recurly.plan(valid, function (err, plan) {
        assert(!err);
        assert(plan);
        assert(plan.code === 'basic');
        assert(plan.name === 'Basic');
        assert(plan.period);
        assert(plan.price);
        assert(typeof plan.tax_exempt === 'boolean');
        done();
      });
    });
  });
});
