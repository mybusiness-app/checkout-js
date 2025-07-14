import { applyFixtures } from './support/fixtures';
import assert from 'assert';
import { initCheckout, stubWindowOpen, testBed } from './support/helpers';
import { Frame } from '../../lib/checkout/frame';

describe('Checkout.Frame', function () {
  const path = '/frame_mock';
  const payload = { example: 'data', event: 'test-event' };

  this.ctx.fixture = 'empty';

  stubWindowOpen();
  applyFixtures();

  beforeEach(function (done) {
    this.checkout = initCheckout();
    this.sandbox = sinon.createSandbox();

    this.sandbox.stub(window.document.body, 'appendChild').callsFake(function (maybeRelay) {
      if (~(maybeRelay.name || '').indexOf('checkout-relay-')) maybeRelay.onload();
      else this.appendChild.wrappedMethod.call(this, maybeRelay);
    });

    this.checkout.ready(() => {
      this.frame = this.checkout.Frame({ path });
      done();
    });
  });

  afterEach(function () {
    const { frame, sandbox } = this;
    sandbox.restore();
    if (frame) frame.destroy();
  });

  it('calls window.open', function () {
    assert(window.open.calledOnce);
  });

  it('sends Checkout.version in the url', function () {
    const { checkout } = this;
    assert(window.open.calledWithMatch(`version=${checkout.version}`));
  });

  it('sends a listener event name to the opened url', function () {
    assert(window.open.calledWithMatch(/checkout-frame-\w+-\w+/));
  });

  it('listens for the frame event', function () {
    const { newWindowEventName, frame } = this;
    assert(frame.hasListeners(newWindowEventName));
  });

  describe('when given a path', function () {
    const examples = [
      '/paypal/start',
      'google.com',
      'bfjbkdfs'
    ];

    it('opens the url relative to checkout.config.api', function () {
      const { checkout } = this;
      examples.forEach(path => {
        const frame = checkout.Frame({ path });
        assert(window.open.calledWithMatch(checkout.config.api + path));
        frame.destroy();
      });
    });
  });

  describe('when given data', function () {
    it('encodes the data into the opener url', function () {
      this.frame = this.checkout.Frame({ path, payload });
      assert(window.open.calledWithMatch('example=data'));
    });

    it('produces a valid composite querystring of given and additional data', function () {
      this.frame = this.checkout.Frame({ path, payload });
      assert(window.open.calledWithMatch(function (url) {
        return (url.match(/\?/) || []).length;
      }));
    });
  });

  describe('when given a default event name', function () {
    it('listens for the default event name', function () {
      this.frame = this.checkout.Frame({
        path,
        payload,
        defaultEventName: 'testing-frame'
      });
      assert(this.frame.hasListeners('testing-frame'));
    });
  });

  describe('when the browser is detected to be IE', function () {
    beforeEach(function () {
      document.documentMode = 'test';

      // rerun this to account for IE mocking
      this.frame = this.checkout.Frame({ path });
    });

    afterEach(function () {
      delete document.documentMode;
    });

    it('creates a relay', function () {
      const { sandbox, frame } = this;
      const { relay } = frame;
      sandbox.spy(frame, 'create');

      assert(relay instanceof HTMLIFrameElement);
      assert.strictEqual(relay.width, '0');
      assert.strictEqual(relay.height, '0');
      assert.strictEqual(!!~relay.src.indexOf('/api/relay'), true);
      assert.strictEqual(relay.name, `checkout-relay-${frame.id}`);
      assert.strictEqual(relay.style.display, 'none');
      assert(relay.onload instanceof Function);
      assert(frame.create.notCalled);
      relay.onload();
      assert(frame.create.calledOnce);
    });

    describe('destroy', function () {
      it('removes the relay', function () {
        const { sandbox, checkout } = this;
        const { body } = window.document;
        sandbox.stub(body, 'contains').returns(true);
        sandbox.stub(body, 'removeChild').returns(true);
        const frame = this.frame = checkout.Frame({ path });
        frame.destroy();
        assert(body.removeChild.calledOnce);
        assert(body.removeChild.calledWithExactly(frame.relay));
      });
    });
  });

  describe('destroy', function () {
    it('closes the window', function () {
      const { checkout, newWindow } = this;
      const frame = checkout.Frame({ path, payload });
      assert(newWindow.close.notCalled);
      frame.destroy();
      assert(newWindow.close.calledOnce);
    });

    it('removes window close listener', function () {
      sinon.spy(global, 'clearInterval');
      this.frame.destroy();
      assert(clearInterval.calledWith(this.frame.windowCloseListenerTick));
    });
  });

  describe('when type=iframe', function () {
    it('requires a container', function () {
      const { checkout } = this;
      assert.throws(() => {
        this.frame = checkout.Frame({ path, payload, type: Frame.TYPES.IFRAME });
      }, {
        message: 'Invalid container. Expected HTMLElement, got undefined'
      });
    });

    describe('when given a container', function () {
      beforeEach(function (done) {
        const { checkout } = this;
        this.frame = checkout.Frame({ path, payload, type: Frame.TYPES.IFRAME, container: testBed() });
        this.frame.on('done', () => done());
      });

      it('injects an iframe into the container', function () {
        assert.strictEqual(testBed().children[0], this.frame.iframe);
      });

      it('sets the url appropriately', function () {
        const { checkout } = this;
        const { src } = this.frame.iframe;
        assert(~src.indexOf('/frame_mock'));
        assert(~src.indexOf('example=data'));
        assert(~src.indexOf(`version=${checkout.version}`));
        assert(~src.indexOf('event=checkout-frame-'));
        assert(~src.indexOf('key=test'));
        assert(!~src.indexOf('credentialCheckoutHostname'));
      });

      describe('when configured to use hostname auth', function () {
        beforeEach(function (done) {
          this.checkout.configure({ hostname: 'test-hostname.mybusinessapp.co.za' });
          this.frame = this.checkout.Frame({ path, payload, type: Frame.TYPES.IFRAME, container: testBed() });
          this.frame.on('done', () => done());
        });

        it('assigns the value in the URL', function () {
          const { src } = this.frame.iframe;
          assert(~src.indexOf('credentialCheckoutHostname=test-hostname.mybusinessapp.co.za'));
        });
      });

      describe('Frame.destroy', function () {
        it('removes the iframe', function () {
          const { frame } = this;
          frame.destroy();
          assert.strictEqual(testBed().children[0], undefined);
          assert.strictEqual(frame.iframe, undefined);
        });
      });
    });
  });

  it('emits a closed event when the frame closes', function (done) {
    this.newWindow = { close: () => this.newWindow.closed = true, closed: false };
    this.timeout(2000); // timeout with error if frame doesn't emit close event
    const frame = this.checkout.Frame({ path }).on('close', () => done());
    frame.window.close();
  });
});
