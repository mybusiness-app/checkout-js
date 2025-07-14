import AlternativePaymentMethods from './alternative-payment-methods';

export function factory (options) {
  const checkout = this;

  return new AlternativePaymentMethods(checkout, options);
}
