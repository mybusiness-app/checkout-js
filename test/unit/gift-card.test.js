import assert from 'assert';
import { Checkout } from '../../lib/checkout';
import { initCheckout } from './support/helpers';

describe('Checkout.giftCard', function () {
  const valid = { code: 'super-gift-card' };
  const invalid = { code: 'invalid' };
  let checkout;

  beforeEach(function () {
    checkout = initCheckout();
  });

  it('requires a callback', function () {
    assert.throws(() => checkout.giftCard(valid), { message: 'Missing callback' });
  });

  it('requires options', function () {
    assert.throws(() => checkout.giftCard(null, () => {}), { message: 'Options must be an object' });
  });

  it('requires options.code', function () {
    assert.throws(() => checkout.giftCard({ arbitrary: 'values' }, () => {}), { message: 'Option code must be a String' });
  });

  it('requires Checkout.configure', function () {
    try {
      checkout = new Checkout();
      checkout.giftCard(valid, () => {});
    } catch (e) {
      assert(~e.message.indexOf('configure'));
    }
  });

  describe('when given an invalid code', function () {
    it('produces an error', function (done) {
      checkout.giftCard(invalid, function (err, giftCard) {
        assert(err);
        assert(!giftCard);
        done();
      });
    });
  });

  describe('when given a valid code', function () {
    it('contains a discount amount', function (done) {
      checkout.giftCard(valid, (err, giftCard) => {
        const { unit_amount, currency } = giftCard;
        assert.strictEqual(unit_amount, 20);
        assert.strictEqual(currency, 'USD');
        done();
      });
    });
  });

  describe('deprecated behavior', function () {
    it('may be called at checkout.giftcard', function (done) {
      checkout.giftcard(valid, (err, giftCard) => {
        assert(!err);
        assert(giftCard);
        done();
      });
    });

    it('accepts options.code as options.giftcard', function (done) {
      checkout.giftCard({ giftcard: valid.code }, (err, giftCard) => {
        assert(!err);
        assert(giftCard);
        done();
      });
    });
  });
});
