import assert from 'assert';
import { applyFixtures } from '../../../support/fixtures';
import { initCheckout, testBed } from '../../../support/helpers';
import SagePayStrategy from '../../../../../lib/checkout/risk/three-d-secure/strategy/sage-pay';
import actionToken from '@mybusinessapp/public-api-test-server/fixtures/tokens/action-token-sage-pay.json';

describe('SagePayStrategy', function () {
  this.ctx.fixture = 'threeDSecure';

  applyFixtures();

  beforeEach(function (done) {
    const checkout = this.checkout = initCheckout();
    const risk = checkout.Risk();
    const threeDSecure = this.threeDSecure = risk.ThreeDSecure({ actionTokenId: 'action-token-test' });
    this.target = testBed().querySelector('#three-d-secure-container');

    this.sandbox = sinon.createSandbox();
    this.sandbox.spy(checkout, 'Frame');

    this.strategy = new SagePayStrategy({ threeDSecure, actionToken });
    this.strategy.whenReady(() => done());
  });

  afterEach(function () {
    const { sandbox, strategy } = this;
    strategy.remove();
    sandbox.restore();
  });

  describe('attach', function () {
    it('creates a frame using the actionToken params', function () {
      const { strategy, target, checkout } = this;
      strategy.attach(target);
      assert(checkout.Frame.calledOnce);
      assert(checkout.Frame.calledWithMatch({
        path: '/three_d_secure/start',
        payload: {
          redirect_url: 'test-sage-pay-acs-url',
          pa_req: 'test-sage-pay-pa-req',
          md: 'test-sage-pay-md',
          creq: 'test-sage-pay-creq',
          three_d_secure_action_token_id: 'action-token-sage-pay'
        },
        defaultEventName: 'sagepay-3ds-challenge'
      }));
    });
  });

  describe('remove', function () {
    it('destroys any existing frame', function () {
      const { strategy, target, sandbox } = this;
      strategy.attach(target);
      sandbox.spy(strategy.frame, 'destroy');
      strategy.remove();
      assert(strategy.frame.destroy.calledOnce);
    });
  });
});
