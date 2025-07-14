export default function paypal () {
  const paypal = window.checkout.PayPal();

  window.checkout.PayPal({
    display: {
      displayName: 'display-name'
    }
  });

  window.checkout.PayPal({
    braintree: {
      clientAuthorization: 'client-authorization'
    }
  });

  window.checkout.PayPal({
    gatewayCode: 'gateway-code',
    payPalComplete: true,
  });

  // @ts-expect-error
  window.checkout.PayPal('string');

  paypal.on('token', () => {});
  paypal.on('error', () => {});
  paypal.on('cancel', () => {});
  paypal.on('ready', () => {});
  // @ts-expect-error
  paypal.on('fake-event', () => {});

  paypal.start();
  paypal.start({
    options: {
      description: 'description'
    }
  });
  paypal.destroy();
}
