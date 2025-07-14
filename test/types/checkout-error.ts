import { CheckoutError } from '@mybusinessapp/checkout-js';

const checkoutError: CheckoutError = {
  code: 'code',
  classification: 'classification',
  message: 'message',
  name: 'name'
};

checkoutError.help = 'help';
checkoutError.fields = ['field'];
checkoutError.details =  [{ field: 'field', messages: ['errors'] }];
