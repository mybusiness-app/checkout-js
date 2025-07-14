import assert from 'assert';
import { initCheckout } from '../support/helpers';
import RiskConcern from '../../../lib/checkout/risk/risk-concern';

describe('RiskConcern', function () {
  beforeEach(function () {
    const checkout = initCheckout();
    this.riskStub = { add: sinon.stub(), remove: sinon.stub(), checkout };
    this.riskConcern = new RiskConcern({ risk: this.riskStub });
  });

  it('adds itself to the provided Risk instance', function () {
    const { riskConcern, riskStub } = this;
    assert(riskStub.add.calledOnce);
    assert(riskStub.add.calledWithExactly(riskConcern));
  });

  describe('checkout', function () {
    it('references the risk checkout instance', function () {
      const { riskConcern, riskStub } = this;
      assert.strictEqual(riskConcern.checkout, riskStub.checkout);
    });
  });

  describe('error', function () {
    it('constructs and emits an error event', function (done) {
      const { riskConcern } = this;
      riskConcern.on('error', err => {
        assert(err.message, 'Option test must be value');
        done();
      });
      assert.throws(() => riskConcern.error('invalid-option'));
    });
  });

  describe('report', function () {
    it('includes its id, namespace, and call-time metadata', function () {
      const { riskConcern } = this;
      riskConcern.risk.checkout.reporter.send.reset();
      riskConcern.report('test-error', { test: 'metadata' });
      assert(riskConcern.risk.checkout.reporter.send.calledOnce);
      assert(riskConcern.risk.checkout.reporter.send.calledWithMatch(
        'base:test-error',
        { concernId: riskConcern.id, test: 'metadata' }
      ));
    });
  });

  describe('destroy', function () {
    it('calls remove', function () {
      const { riskConcern } = this;
      sinon.spy(riskConcern, 'remove');
      riskConcern.destroy();
      assert(riskConcern.remove.calledOnce);
    });

    it('calls risk.remove', function () {
      const { riskConcern, riskStub } = this;
      riskConcern.destroy();
      assert(riskStub.remove.calledOnce);
    });

    it('removes event listeners', function () {
      const { riskConcern } = this;
      const example = sinon.stub();
      riskConcern.on('test', example);
      assert.strictEqual(riskConcern.hasListeners('test', example), true);
      riskConcern.destroy();
      assert.strictEqual(riskConcern.hasListeners('test', example), false);
    });
  });
});
