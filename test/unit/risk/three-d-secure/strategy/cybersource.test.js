import assert from 'assert';
import { applyFixtures } from '../../../support/fixtures';
import { initCheckout, testBed } from '../../../support/helpers';
import CybersourceStrategy from '../../../../../lib/checkout/risk/three-d-secure/strategy/cybersource';
import actionToken from '@mybusinessapp/public-api-test-server/fixtures/tokens/action-token-cybersource.json';
import Promise from 'promise';
import { Frame } from '../../../../../lib/checkout/frame';

describe('CybersourceStrategy', function () {
  this.ctx.fixture = 'threeDSecure';

  applyFixtures();

  beforeEach(function (done) {
    const checkout = this.checkout = initCheckout();
    const risk = checkout.Risk();
    const threeDSecure = this.threeDSecure = risk.ThreeDSecure({ actionTokenId: 'action-token-test' });
    this.target = testBed().querySelector('#three-d-secure-container');

    this.sandbox = sinon.createSandbox();
    this.sandbox.spy(checkout, 'Frame');

    this.Strategy = CybersourceStrategy;
    this.strategy = new CybersourceStrategy({ threeDSecure, actionToken });
    this.strategy.whenReady(() => done());
  });

  afterEach(function () {
    const { sandbox, strategy } = this;
    strategy.remove();
    sandbox.restore();
  });

  describe('CybersourceStrategy.preflight', function () {
    beforeEach(function () {
      const { checkout } = this;
      this.sessionId = 'test-cybersource-session-id';
      this.number = '4111111111111111';
      this.month = '01';
      this.year = '2023';
      this.gateway_code = 'test-gateway-code';
      this.jwt = 'test-preflight-jwt';
      this.poll = setInterval(() => {
        // Stubs expected message format from Cybersource DDC
        checkout.bus.emit('raw-message', {
          data: JSON.stringify({
            MessageType: 'profile.completed',
            SessionId: this.sessionId
          })
        });
      }, 10);
    });

    it('returns a promise', function (done) {
      const { checkout, Strategy, number, month, year, gateway_code, poll } = this;

      const retValue = Strategy.preflight({ checkout, number, month, year, gateway_code }).then(() => {
        clearInterval(poll);
        done();
      });

      assert(retValue instanceof Promise);
    });

    it('constructs a frame to collect a session id', function (done) {
      const { checkout, Strategy, number, month, year, gateway_code, jwt, poll } = this;

      Strategy.preflight({ checkout, number, month, year, gateway_code }).then(() => {
        sinon.assert.callCount(checkout.Frame, 1);
        assert(checkout.Frame.calledWithMatch({
          path: '/risk/data_collector',
          payload: {
            jwt,
            redirect_url: 'https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect'
          },
          type: Frame.TYPES.IFRAME,
          height: 0,
          width: 0
        }));

        clearInterval(poll);
        done();
      });
    });

    it('resolves when a session id is received', function (done) {
      const { checkout, Strategy, sessionId, number, month, year, gateway_code, poll } = this;

      Strategy.preflight({ checkout, number, month, year, gateway_code }).then(preflightResponse => {
        assert.strictEqual(preflightResponse.results.session_id, sessionId);

        clearInterval(poll);
        done();
      });
    });

    describe('device data collection', function () {
      describe('device data collection disabled when set to false', function () {
        beforeEach(function () {
          this.checkout.config.risk.threeDSecure.preflightDeviceDataCollector = {
            enabled: false
          };
        });

        it('does not construct a frame to collect a session id', function (done) {
          const { checkout, Strategy, number, month, year, gateway_code } = this;

          Strategy.preflight({ checkout, number, month, year, gateway_code }).then(() => {
            sinon.assert.callCount(checkout.Frame, 0);
            done();
          });
        });
      });

      describe('device data collection enabled when set to true', function () {
        beforeEach(function () {
          this.checkout.config.risk.threeDSecure.preflightDeviceDataCollector = {
            enabled: true
          };
        });
  
        it('does construct a frame to collect a session id', function (done) {
          const { checkout, Strategy, number, month, year, gateway_code } = this;
  
          Strategy.preflight({ checkout, number, month, year, gateway_code }).then(() => {
            sinon.assert.callCount(checkout.Frame, 1);
            done();
          });
        });
      });

      describe('device data collection enabled when object is preset', function () {
        beforeEach(function () {
          this.checkout.config.risk.threeDSecure.preflightDeviceDataCollector = {
            enabled: true,
            billingInfoId: 'test-billing-info-id',
          };
        });
  
        it('does construct a frame to collect a session id', function (done) {
          const { checkout, Strategy, number, month, year, gateway_code } = this;
  
          Strategy.preflight({ checkout, number, month, year, gateway_code }).then(() => {
            sinon.assert.callCount(checkout.Frame, 1);
            done();
          });
        });
      });
    });
  });

  describe('attach', function () {
    it('creates a frame using the actionToken params', function () {
      const { strategy, target, checkout } = this;
      strategy.attach(target);
      assert(checkout.Frame.calledOnce);
      assert(checkout.Frame.calledWithMatch({
        path: '/three_d_secure/start',
        payload: {
          redirect_url: actionToken.three_d_secure.params.redirect_url,
          three_d_secure_action_token_id: actionToken.id
        }
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
