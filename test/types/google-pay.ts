import {
  GooglePayPaymentData,
  GooglePayPaymentAuthorizationResult,
} from '@mybusinessapp/checkout-js';

export default function googlePay () {
  window.checkout.GooglePay({
    currency: 'USD',
    country: 'US',
    total: '1.00',
    googleMerchantId: 'CHECKOUT',
    googleBusinessName: 'CHECKOUT',
    gatewayCode: 'abc123',
    requireBillingAddress: true,
  });

  window.checkout.GooglePay({
    currency: 'USD',
    country: 'US',
    total: '1.00',
    requireBillingAddress: true,
    paymentDataRequest: {
      emailRequired: true,
      merchantInfo: {
        merchantId: 'CHECKOUT',
        merchantName: 'CHECKOUT',
      },
      transactionInfo: {
        displayItems: [
          { label: 'Subtotal', type: 'SUBTOTAL', price: '1.00' },
        ],
      }
    },
    buttonOptions: {
      buttonColor: 'black',
    },
    callbacks: {
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      onPaymentAuthorized: (paymentData: GooglePayPaymentData): Promise<GooglePayPaymentAuthorizationResult> | void => {
        if (paymentData.email === 'test@example.com') {
          return Promise.reject({
            error: {
              intent: 'PAYMENT_AUTHORIZATION',
              message: 'Insufficient funds',
              reason: 'PAYMENT_DATA_INVALID'
            }
          });
        }
      },
    },
  });
}
