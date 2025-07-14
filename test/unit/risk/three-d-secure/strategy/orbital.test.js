import assert from 'assert';
import { applyFixtures } from '../../../support/fixtures';
import { initCheckout, testBed } from '../../../support/helpers';
import OrbitalStrategy from '../../../../../lib/checkout/risk/three-d-secure/strategy/orbital';
import actionToken from '@mybusinessapp/public-api-test-server/fixtures/tokens/action-token-orbital.json';

describe('OrbitalStrategy', function () {
  this.ctx.fixture = 'threeDSecure';

  applyFixtures();

  beforeEach(function (done) {
    const checkout = this.checkout = initCheckout();
    const risk = checkout.Risk();
    const threeDSecure = this.threeDSecure = risk.ThreeDSecure({ actionTokenId: 'action-token-test' });
    this.target = testBed().querySelector('#three-d-secure-container');

    this.sandbox = sinon.createSandbox();
    this.sandbox.spy(checkout, 'Frame');

    this.strategy = new OrbitalStrategy({ threeDSecure, actionToken });
    this.strategy.whenReady(() => done());
  });

  afterEach(function () {
    this.strategy.remove();
    this.sandbox.restore();
  });

  describe('attach', function () {
    it('creates a frame using the actionToken params', function () {
      const { strategy, target, checkout } = this;
      strategy.attach(target);
      assert(checkout.Frame.calledOnce);
      assert(checkout.Frame.calledWithMatch({
        path: '/three_d_secure/start',
        payload: {
          redirect_url: 'test-orbital-acs-url',
          pa_req: 'test-orbital-pa-req',
          md: 'test-orbital-md',
          creq: 'test-orbital-creq',
          three_d_secure_action_token_id: 'action-token-orbital'
        },
        defaultEventName: 'orbital-3ds-challenge'
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
