import assert from 'assert';
import { Checkout } from '../../lib/checkout';
import { initCheckout } from './support/helpers';

describe('Checkout.plan', function () {
  const valid = 'basic';
  const invalid = 'invalid';

  beforeEach(function () {
    this.checkout = initCheckout();
  });

  it('requires a callback', function () {
    const { checkout } = this;
    assert.throws(() => checkout.plan(valid), { message: 'Missing callback' });
  });

  it('requires a plan code', function (done) {
    const { checkout } = this;
    checkout.plan(undefined, (err) => {
      assert.strictEqual(err.message, 'Missing plan code');
      done();
    });
  });

  it('requires Checkout.configure', function () {
    try {
      const checkout = new Checkout();
      checkout.plan(valid, () => {});
    } catch (e) {
      assert(~e.message.indexOf('configure'));
    }
  });

  describe('when given an invalid plan', function () {
    it('produces an error', function (done) {
      const { checkout } = this;
      checkout.plan(invalid, function (err, plan) {
        assert(err);
        assert(!plan);
        done();
      });
    });
  });

  describe('when given a valid plan', function () {
    it('yields a plan', function (done) {
      const { checkout } = this;
      checkout.plan(valid, function (err, plan) {
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
