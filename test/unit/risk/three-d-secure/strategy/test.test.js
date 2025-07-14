import assert from 'assert';
import { applyFixtures } from '../../../support/fixtures';
import { initCheckout, testBed } from '../../../support/helpers';
import TestStrategy from '../../../../../lib/checkout/risk/three-d-secure/strategy/test';
import actionToken from '@mybusinessapp/public-api-test-server/fixtures/tokens/action-token-test.json';
import { Frame } from '../../../../../lib/checkout/frame';
import { ThreeDSecure } from '../../../../../lib/checkout/risk/three-d-secure';

describe('TestStrategy', function () {
  this.ctx.fixture = 'threeDSecure';

  applyFixtures();

  beforeEach(function () {
    const checkout = this.checkout = initCheckout();
    const challengeWindowSize = ThreeDSecure.CHALLENGE_WINDOW_SIZE_03_500_X_600;
    const threeDSecure = this.threeDSecureStub = { risk: { checkout }, error: sinon.stub(), challengeWindowSize };
    this.strategy = new TestStrategy({ threeDSecure, actionToken });
    this.target = testBed().querySelector('#three-d-secure-container');
    this.sandbox = sinon.createSandbox();
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  describe('attach', function () {
    describe('when the actionToken requires a challenge', function () {
      beforeEach(function () {
        const { sandbox, checkout } = this;
        sandbox.spy(checkout, 'Frame');
      });

      it('presents a challenge dialogue in a frame', function (done) {
        const { strategy, target, checkout } = this;
        strategy.on('done', result => {
          assert(checkout.Frame.calledOnce);
          assert(checkout.Frame.calledWithMatch({
            type: Frame.TYPES.IFRAME,
            path: '/three_d_secure/mock',
            payload: {
              three_d_secure_action_token_id: 'action-token-test',
              iframe_size: ThreeDSecure.CHALLENGE_WINDOW_SIZE_03_500_X_600
            },
            container: strategy.container
          }));
          assert.strictEqual(result.success, true);
          done();
        });
        strategy.attach(target);
      });

      describe('when the mock challenge is failed', function () {
        it('emits an error to its threeDSecure instance', function (done) {
          const { threeDSecureStub: threeDSecure, target } = this;
          const failureActionToken = Object.assign({}, actionToken, {
            id: 'test-action-token-failure-id'
          });
          const strategy = new TestStrategy({ threeDSecure, actionToken: failureActionToken });
          strategy.on('error', error => {
            assert.strictEqual(error.cause.success, false);
            done();
          });
          strategy.attach(target);
        });
      });
    });

    describe('when the actionToken requires a fingerprint', function () {
      beforeEach(function () {
        const { threeDSecureStub: threeDSecure } = this;
        const fingerprintActionToken = Object.assign({}, actionToken, {
          three_d_secure: {
            params: {
              challengeType: 'fingerprint'
            }
          }
        });

        this.strategy = new TestStrategy({ threeDSecure, actionToken: fingerprintActionToken });
      });

      it('emits done with success', function (done) {
        const { strategy, target } = this;
        strategy.on('done', result => {
          assert.strictEqual(result.type, 'fingerprint');
          assert.strictEqual(result.success, true);
          done();
        });
        strategy.attach(target);
      });
    });
  });
});
