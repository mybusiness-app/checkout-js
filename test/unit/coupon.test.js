import each from 'lodash.foreach';
import assert from 'assert';
import { Checkout } from '../../lib/checkout';
import { initCheckout } from './support/helpers';

describe('Checkout.coupon', () => {
  let valid = { coupon: 'coop' };

  beforeEach(function () {
    this.checkout = initCheckout();
  });

  it('requires a callback', function () {
    try {
      this.checkout.coupon(valid);
    } catch (e) {
      assert(~e.message.indexOf('callback'));
    }
  });

  it('requires Checkout.configure', function () {
    try {
      let newCheckout = new Checkout();
      newCheckout.coupon(valid, () => {});
    } catch (e) {
      assert(~e.message.indexOf('configure'));
    }
  });

  describe('when providing a plan code', () => {
    const invalidPlan = { plan: 'invalid', coupon: 'coop' };
    const invalidCoupon = { plan: 'basic', coupon: 'coop-invalid' };

    describe('when given an invalid plan', function () {
      it('responds with a coupon', function (done) {
        this.checkout.coupon(invalidPlan, function (err, coupon) {
          assert(!err);
          assert(coupon);
          assert(coupon.code);
          assert(coupon.name);
          done();
        });
      });
    });

    describe('when given a valid plan', function () {
      describe('when given an invalid coupon', function () {
        it('should throw an error', function (done) {
          this.checkout.coupon(invalidCoupon, function (err, coupon) {
            assert(err);
            assert(!coupon);
            done();
          });
        });
      });

      describe('when given a valid coupon', function () {
        it('contains a discount amount', function (done) {
          assertValidCoupon(this.checkout, 'coop', function (coupon) {
            assert(!coupon.discount.rate);
            each(coupon.discount.amount, (amount, currency) => {
              assert(currency.length === 3);
              assert(typeof amount === 'number');
            });
            done();
          });
        });
      });

      describe('when given a valid percent-based coupon', function () {
        it('contains a discount rate', function (done) {
          assertValidCoupon(this.checkout, 'coop-pct', function (coupon) {
            assert(typeof coupon.discount.rate === 'number');
            done();
          });
        });
      });
    });
  });

  function assertValidCoupon (checkout, code, done) {
    checkout.coupon({ plan: 'basic', coupon: code }, function (err, coupon) {
      assert(coupon);
      assert(coupon.code);
      assert(coupon.name);
      done(coupon);
    });
  }
});
