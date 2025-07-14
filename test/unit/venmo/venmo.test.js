import assert from 'assert';
import { BraintreeStrategy } from '../../../lib/checkout/venmo/strategy/braintree';
import {
  initCheckout,
  stubBraintree,
  stubWindowOpen
} from '../support/helpers';

describe('Checkout.Venmo', function () {
  stubWindowOpen();
  stubBraintree();

  const validOpts = { braintree: { clientAuthorization: 'valid' } };

  beforeEach(function () {
    this.checkout = initCheckout();
    this.venmo = this.checkout.Venmo(validOpts);
    this.sandbox = sinon.createSandbox();
  });

  it('uses a Braintree strategy by default', function () {
    assert(this.venmo.strategy instanceof BraintreeStrategy);
  });

  describe('destroy', function () {
    it('deletes the strategy and removes listeners', function () {
      this.sandbox.spy(this.venmo, 'off');
      this.venmo.destroy();
      assert.equal(this.venmo.strategy, undefined);
      assert(this.venmo.off.calledOnce);
    });
  });
});
