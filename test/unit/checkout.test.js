import assert from 'assert';
import { applyFixtures } from './support/fixtures';
import { initCheckout, nextTick, testBed } from './support/helpers';
import { isAUid } from './support/matchers';
import { Checkout } from '../../lib/checkout';
import CheckoutPricing from '../../lib/checkout/pricing/checkout';
import Elements from '../../lib/checkout/elements';
import SubscriptionPricing from '../../lib/checkout/pricing/subscription';

describe('Checkout', function () {
  beforeEach(function () {
    this.checkout = new Checkout;
    this.sandbox = sinon.createSandbox();
  });

  afterEach(function () {
    this.sandbox.reset();
  });

  it('should have a version', function () {
    const { checkout } = this;
    assert(typeof checkout.version === 'string');
  });

  it('should be an event emitter', function () {
    const { checkout } = this;
    assert(checkout.on && checkout.emit);
  });

  it('should be exposed as a window singleton', function () {
    assert(window.checkout instanceof window.checkout.Checkout);
  });

  describe('Checkout', function () {
    it('is the Checkout constructor', function () {
      const { checkout } = this;
      assert.strictEqual(checkout.Checkout, checkout.constructor);
      assert(checkout.Checkout() instanceof Checkout);
    });
  });

  describe('id', function () {
    beforeEach(function () { this.subject = this.checkout.id; });
    it(...isAUid());
  });

  describe('deviceId', function () {
    beforeEach(function () { this.subject = this.checkout.deviceId; });
    it(...isAUid());

    it('is set on localStorage', function () {
      const { subject } = this;
      assert.strictEqual(subject, localStorage.getItem('__checkout__.deviceId'));
    });
  });

  describe('sessionId', function () {
    beforeEach(function () { this.subject = this.checkout.sessionId; });
    it(...isAUid());

    it('is set on sessionStorage', function () {
      const { subject } = this;
      assert.strictEqual(subject, sessionStorage.getItem('__checkout__.sessionId'));
    });
  });

  describe('isCanaryOneThousandthSession', function () {
    beforeEach(function () { this.subject = this.checkout.isCanaryOneThousandthSession; });

    it('is a Boolean set on sessionStorage as a string', function () {
      const { subject } = this;
      assert.strictEqual(typeof subject, 'boolean');
      assert.strictEqual(subject.toString(), sessionStorage.getItem('__checkout__.isCanaryOneThousandthSession'));
    });
  });

  describe('configure', function () {
    describe('when called repeatedly', function () {
      it('persists bus recipients', function () {
        const { checkout, sandbox } = this;
        const stub = sandbox.stub();
        initCheckout(checkout);
        checkout.bus.add(stub);
        assert.strictEqual(!!~checkout.bus.recipients.indexOf(stub), true);
        checkout.configure({ publicKey: 'test-2' });
        assert.strictEqual(!!~checkout.bus.recipients.indexOf(stub), true);
      });

      describe('when hostedFields are not finished initializing', function () {
        applyFixtures();

        this.ctx.fixture = 'multipleForms';

        it('resets hostedFields and abandons the prior listeners', function (done) {
          const { checkout, sandbox } = this;
          const readyStub = sandbox.stub();
          sandbox.spy(checkout, 'off');
          assert.strictEqual(checkout.readyState, 0);
          initCheckout(checkout, {
            fields: {
              number: { selector: '#number-1' },
              month: { selector: '#month-1' },
              year: { selector: '#year-1' },
              cvv: { selector: '#cvv-1' }
            }
          });
          assert.strictEqual(checkout.readyState, 1);
          assert(checkout.off.notCalled);
          checkout.configure({
            fields: {
              number: { selector: '#number-2' },
              month: { selector: '#month-2' },
              year: { selector: '#year-2' },
              cvv: { selector: '#cvv-2' }
            }
          });
          assert.strictEqual(checkout.readyState, 1);
          checkout.on('hostedFields:ready', readyStub);

          checkout.ready(() => {
            // perform on next tick to allow the ready callback stack to proceed to the stub
            nextTick(() => {
              assert.strictEqual(checkout.readyState, 2);
              assert(readyStub.calledOnce);
              assert.strictEqual(testBed().querySelectorAll('#test-form-1 iframe').length, 0);
              assert.strictEqual(testBed().querySelectorAll('#test-form-2 iframe').length, 4);
              assert(checkout.off.calledWithExactly('hostedFields:ready'));
              assert(checkout.off.calledWithExactly('hostedFields:state:change'));
              assert(checkout.off.calledWithExactly('hostedField:submit'));
              done();
            });
          });
        });
      });
    });

    describe('when switching form different keyspaces', function () {
      const DEFAULT_API_URL = 'https://mpp-api-mybusinessapp-san.azure-api.net/js/v1';
      const DEFAULT_API_URL_EU = 'https://mpp-api-mybusinessapp-san.azure-api.net/eu/js/v1';
      const SAMPLE_API = 'https://api.test.com';
      describe('when publicKey of merchant is from eu', function () {
        it('returns the eu api url', function () {
          const checkout = new Checkout;
          checkout.configure({ publicKey: 'fra-2test2' });
          assert.strictEqual(checkout.config.api, DEFAULT_API_URL_EU);
        });
      });
      describe('when publicKey of merchant is from us', function () {
        it('returns the us api url', function () {
          const checkout = new Checkout;
          checkout.configure({ publicKey: 'ewr-1test1' });
          assert.strictEqual(checkout.config.api, DEFAULT_API_URL);
        });
      });
      describe('when publicKey is from eu and api is passed', function () {
        it('returns the default api url', function () {
          const checkout = initCheckout({ publicKey: 'fra-3test3', api: SAMPLE_API });
          assert.strictEqual(checkout.config.api, SAMPLE_API);
        });
      });
      describe('when publicKey is from us and api is passed', function () {
        it('returns the default api url', function () {
          const checkout = initCheckout({ publicKey: 'ewr-3test3', api: SAMPLE_API });
          assert.strictEqual(checkout.config.api, SAMPLE_API);
        });
      });
    });

    describe('when preflightDeviceDataCollector is a boolean', function () {
      describe('and is set to true', function () {
        it('enabled is set to true', function () {
          const checkout = new Checkout;
          checkout.configure(
            {
              publicKey: 'fra-2test2',
              risk: {
                threeDSecure: {
                  preflightDeviceDataCollector: true
                }
              }
            });
          
          assert.strictEqual(checkout.config.risk.threeDSecure.preflightDeviceDataCollector.enabled, true);
        });
      });
      describe('and is set to false', function () {
        it('enabled is false', function () {
          const checkout = new Checkout;
          checkout.configure(
            {
              publicKey: 'fra-2test2',
              risk: {
                threeDSecure: {
                  preflightDeviceDataCollector: false
                }
              }
            });
          
          assert.strictEqual(checkout.config.risk.threeDSecure.preflightDeviceDataCollector.enabled, false);
        });
      });
    });

    describe('when proactive3ds', function () {
      describe('is set to true', function () {
        it('returns true', function () {
          const checkout = initCheckout({
            risk: {
              threeDSecure: {
                proactive: {
                  enabled: true
                }
              }
            }
          });
          assert.strictEqual(checkout.config.risk.threeDSecure.proactive.enabled, true);
        });
      });
      describe('is not set', function () {
        it('returns false', function () {
          const checkout = initCheckout({});
          assert.strictEqual(checkout.config.risk.threeDSecure.proactive.enabled, false);
        });
      });
    });
  });

  describe('destroy', function () {
    it('disables listeners', function () {
      const { checkout } = this;
      const listener = sinon.stub();

      checkout.on('test-event', listener);
      assert(listener.notCalled);

      checkout.emit('test-event');
      assert(listener.calledOnce);
      assert.strictEqual(checkout.hasListeners('test-event'), true);

      checkout.destroy();

      assert.strictEqual(checkout.hasListeners('test-event'), false);
      checkout.emit('test-event');

      listener.reset();
      assert(listener.notCalled);
    });

    it('sends a destroy message to its bus', function () {
      const { checkout } = this;
      checkout.bus = { send: sinon.stub(), destroy: sinon.stub() };
      assert(checkout.bus.send.notCalled);
      assert(checkout.bus.destroy.notCalled);

      checkout.destroy();

      assert(checkout.bus.send.calledOnce);
      assert(checkout.bus.send.calledWithExactly('destroy'));
      assert(checkout.bus.destroy.calledOnce);
    });

    it('destroys its fraud module', function () {
      const { checkout } = this;
      checkout.fraud = { destroy: sinon.stub() };
      assert(checkout.fraud.destroy.notCalled);

      checkout.destroy();

      assert(checkout.fraud.destroy.calledOnce);
    });

    it('destroys its reporter', function () {
      const { checkout } = this;
      const stubReporter = { destroy: sinon.stub() };
      checkout.reporter = stubReporter;
      assert(stubReporter.destroy.notCalled);

      checkout.destroy();

      assert(stubReporter.destroy.calledOnce);
      assert.strictEqual(checkout.reporter, undefined);
    });
  });

  describe('Pricing factories', function () {
    it('has a CheckoutPricing factory at checkout.Pricing.Checkout', function () {
      const { checkout } = this;
      assert(checkout.Pricing.Checkout() instanceof CheckoutPricing);
    });

    it('has a SubscriptionPricing factory at checkout.Pricing.Subscription', function () {
      const { checkout } = this;
      assert(checkout.Pricing.Subscription() instanceof SubscriptionPricing);
    });

    it('has a SubscriptionPricing factory at checkout.Pricing', function () {
      const { checkout } = this;
      assert(checkout.Pricing() instanceof SubscriptionPricing);
    });
  });

  describe('events', function () {
    describe('hosted field events', function () {
      beforeEach(function () {
        const { checkout } = this;
        sinon.spy(checkout, 'report');
        this.hostedFieldsStub = {
          state: { testField: { type: 'test-type', valid: 'test-valid', empty: 'test-empty' } }
        };
        checkout.hostedFields = this.hostedFieldsStub;
      });

      it('binds hosted field focus and blur events to report calls', function () {
        const { checkout, hostedFieldsStub } = this;
        checkout.emit('hostedField:focus', { type: 'testField' });
        assert(checkout.report.calledOnce);
        assert(checkout.report.calledWithMatch(
          'hosted-field:focus',
          hostedFieldsStub.state.testField
        ));
      });
    });
  });

  describe('Elements factory', () => {
    it('has an Elements factory at checkout.Elements', function () {
      const { checkout } = this;
      assert(checkout.Elements() instanceof Elements);
    });
  });
});
