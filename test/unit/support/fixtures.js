import { testBed } from './helpers';

const commonFields = opts => `
  <input type="text" data-checkout="first_name" value="${fetch(opts, 'first_name', '')}">
  <input type="text" data-checkout="last_name" value="${fetch(opts, 'last_name', '')}">
  <input type="text" data-checkout="address1" value="${fetch(opts, 'address1', '')}">
  <input type="text" data-checkout="address2" value="${fetch(opts, 'address2', '')}">
  <input type="text" data-checkout="city" value="${fetch(opts, 'city', '')}">
  <input type="text" data-checkout="state" value="${fetch(opts, 'state', '')}">
  <input type="text" data-checkout="postal_code" value="${fetch(opts, 'postal_code', '')}">
  <input type="text" data-checkout="phone" value="${fetch(opts, 'phone', '')}">
  <input type="text" data-checkout="vat_number" value="${fetch(opts, 'vat_number', '')}">
  <input type="text" data-checkout="country" value="${fetch(opts, 'country', '')}">
  <input type="hidden" name="checkout-token" data-checkout="token">
`;

const elements = opts => `
  <form action="#" id="test-form">
    <input type="text" id="test-focus-el">
    <input type="text" id="test-tab-prev">
    <div id="checkout-elements"></div>
    <div id="checkout-elements-two"></div>
    <input type="text" id="test-tab-next">
    ${commonFields(opts)}
    <input type="text" data-checkout="tax_identifier" value="${opts.tax_identifier || ''}">
    <input type="text" data-checkout="tax_identifier_type" value="cpf">
    <input type="hidden" data-checkout="token" name="checkout-token">
  </form>
`;

const minimal = opts => `
  <form action="#" id="test-form">
    <div data-checkout="number"></div>
    <div data-checkout="month"></div>
    <div data-checkout="year"></div>
    <div data-checkout="cvv"></div>
    <input type="text" data-checkout="first_name" value="${opts.first_name || ''}">
    <input type="text" data-checkout="last_name" value="${opts.last_name || ''}">
    <input type="text" data-checkout="tax_identifier" value="${opts.tax_identifier || ''}">
    <input type="text" data-checkout="tax_identifier_type" value="cpf">
    <input type="hidden" data-checkout="token" name="checkout-token">
  </form>
`;

const all = opts => `
  <form action="#" id="test-form">
    <div data-checkout="number"></div>
    <div data-checkout="month"></div>
    <div data-checkout="year"></div>
    <div data-checkout="cvv"></div>
    ${commonFields(opts)}
    <input type="text" data-checkout="tax_identifier" value="${opts.tax_identifier || ''}">
    <input type="text" data-checkout="tax_identifier_type" value="cpf">
  </form>
`;

const bank = opts => `
  <form action="#" id="test-form">
    <input type="text" data-checkout="name_on_account" value="${fetch(opts, 'name_on_account', '')}">
    <input type="text" data-checkout="routing_number" value="${fetch(opts, 'routing_number', '')}">
    <input type="text" data-checkout="account_number" value="${fetch(opts, 'account_number', '')}">
    <input type="text" data-checkout="account_number_confirmation" value="${fetch(opts, 'account_number_confirmation', '')}">
    <input type="text" data-checkout="account_type" value="${fetch(opts, 'account_type', '')}">
    ${commonFields(opts)}
    <button>submit</button>
  </form>
`;

const pricing = opts => `
  <div id="test-pricing">
    <input type="text" data-checkout="plan" value="${fetch(opts, 'plan', '')}">
    <input type="text" data-checkout="plan_quantity" value="${fetch(opts, 'plan_quantity', '')}">
    <input type="text" data-checkout="coupon" value="${fetch(opts, 'coupon', '')}">
    <input type="text" data-checkout="gift_card" value="${fetch(opts, 'giftcard', '')}">
    ${opts.addon ? `<input type="text" data-checkout="addon" data-checkout-addon="${fetch(opts.addon, 'code')}" value="${fetch(opts.addon, 'quantity')}">` : ''}
    <input type="text" data-checkout="currency" value="${fetch(opts, 'currency', 'USD')}">
    <input type="text" data-checkout="country" value="${fetch(opts, 'country', 'US')}">
    <input type="text" data-checkout="postal_code" value="${fetch(opts, 'postal_code', '')}">
    <input type="text" data-checkout="tax_code" value="${fetch(opts, 'tax_code', '')}">
    <input type="text" data-checkout="vat_number" value="${fetch(opts, 'vat_number', '')}">
    ${'tax_amount.now' in opts ? `<input type="text" data-checkout="tax_amount.now" value="${fetch(opts, 'tax_amount.now', '')}">` : ''}
    ${'tax_amount.next' in opts ? `<input type="text" data-checkout="tax_amount.next" value="${fetch(opts, 'tax_amount.next', '')}">` : ''}

    ${opts['shipping_address.country'] ? `<input type="text" data-checkout="shipping_address.country" value="${fetch(opts, 'shipping_address.country', '')}">` : '' }
    ${opts['shipping_address.postal_code'] ? `<input type="text" data-checkout="shipping_address.postal_code" value="${fetch(opts, 'shipping_address.postal_code', '')}">` : '' }

    <span data-checkout="total_now"></span>
    <span data-checkout="subtotal_now"></span>
    <span data-checkout="addons_now"></span>
    <span data-checkout="discount_now"></span>
    <span data-checkout="setup_fee_now"></span>
    <span data-checkout="tax_now"></span>

    <span data-checkout="total_next"></span>
    <span data-checkout="subtotal_next"></span>
    <span data-checkout="addons_next"></span>
    <span data-checkout="discount_next"></span>
    <span data-checkout="setup_fee_next"></span>
    <span data-checkout="tax_next"></span>

    <span data-checkout="currency_code"></span>
    <span data-checkout="currency_symbol"></span>
  </div>
`;

const checkoutPricing = opts => `
  <div id="test-pricing">
    <input type="text" data-checkout-subscription="sub-0" data-checkout="plan" value="${fetch(opts, 'sub_0_plan', '')}">
    <input type="text" data-checkout-subscription="sub-0" data-checkout="plan_quantity" value="${fetch(opts, 'sub_0_plan_quantity', '')}">
    <input type="text" data-checkout-subscription="sub-0" data-checkout="tax_code" value="${fetch(opts, 'sub_0_tax_code', '')}">

    <input type="text" data-checkout-subscription="sub-1" data-checkout="plan" value="${fetch(opts, 'sub_1_plan', '')}">
    <input type="text" data-checkout-subscription="sub-1" data-checkout="plan_quantity" value="${fetch(opts, 'sub_1_plan_quantity', '')}">
    <input type="text" data-checkout-subscription="sub-1" data-checkout="tax_code" value="${fetch(opts, 'sub_1_tax_code', '')}">

    <input type="text" value="${fetch(opts, 'adj_0')}"
      data-checkout="adjustment"
      data-checkout-adjustment="adj-0"
      data-checkout-adjustment-amount="10"
      data-checkout-adjustment-tax-code="adj-tax-code-0"
    >

    <input type="text" value="${fetch(opts, 'adj_1')}"
      data-checkout="adjustment"
      data-checkout-adjustment="adj-1"
      data-checkout-adjustment-amount="20"
      data-checkout-adjustment-tax-code="adj-tax-code-1"
    >

    <input type="text" data-checkout="coupon" value="${fetch(opts, 'coupon', '')}">
    <input type="text" data-checkout="gift_card" value="${fetch(opts, 'giftcard', '')}">
    <input type="text" data-checkout="currency" value="${fetch(opts, 'currency', 'USD')}">
    <input type="text" data-checkout="country" value="${fetch(opts, 'country', 'US')}">
    <input type="text" data-checkout="postal_code" value="${fetch(opts, 'postal_code', '')}">
    <input type="text" data-checkout="vat_number" value="${fetch(opts, 'vat_number', '')}">
    ${'tax_amount.now' in opts ? `<input type="text" data-checkout="tax_amount.now" value="${fetch(opts, 'tax_amount.now', '')}">` : ''}
    ${'tax_amount.next' in opts ? `<input type="text" data-checkout="tax_amount.next" value="${fetch(opts, 'tax_amount.next', '')}">` : ''}

    <span data-checkout="total_now"></span>
    <span data-checkout="subtotal_now"></span>
    <span data-checkout="subscriptions_now"></span>
    <span data-checkout="adjustments_now"></span>
    <span data-checkout="discount_now"></span>
    <span data-checkout="gift_card_now"></span>
    <span data-checkout="taxes_now"></span>

    <span data-checkout="total_next"></span>
    <span data-checkout="subtotal_next"></span>
    <span data-checkout="subscriptions_next"></span>
    <span data-checkout="adjustments_next"></span>
    <span data-checkout="discount_next"></span>
    <span data-checkout="gift_card_next"></span>
    <span data-checkout="taxes_next"></span>

    <span data-checkout="currency_code"></span>
    <span data-checkout="currency_symbol"></span>
  </div>
`;

const multipleForms = () => `
  <form action="#" id="test-form-1">
    <div id="number-1"></div>
    <div id="month-1"></div>
    <div id="year-1"></div>
    <div id="cvv-1"></div>
    <input type="hidden" data-checkout="token" name="checkout-token">
  </form>

  <form action="#" id="test-form-2">
    <div id="number-2"></div>
    <div id="month-2"></div>
    <div id="year-2"></div>
    <div id="cvv-2"></div>
    <input type="hidden" data-checkout="token" name="checkout-token">
  </form>
`;

const iframe = opts => `
  <iframe
    id="${fetch(opts, 'id', 'test-iframe')}"
    src="${fetch(opts, 'src', 'https://google.com')}"
  ></iframe>
`;

const threeDSecure = () => '<div id="three-d-secure-container"></div>';

const emptyForm = () => '<form id="test-form"></form>';

const multipleEmptyForms = () => `
  <form id="test-form-1"></form>
  <form id="test-form-2"></form>
`;

const selectLists = (name) => `<select id="${name}" name="${name}"></select>`;

const selectListsFull = ({ list, selectId }) => {
  const options = list.map(({ id, name }) => `<option value="${id}">${name}</option>`).join('');
  return `<select id="${selectId}" name="${selectId}">${options}</select>`;
};

const empty = '';

const FIXTURES = {
  elements,
  minimal,
  all,
  bank,
  pricing,
  checkoutPricing,
  multipleForms,
  iframe,
  threeDSecure,
  empty,
  emptyForm,
  multipleEmptyForms,
  selectLists,
  selectListsFull,
};

export function applyFixtures () {
  beforeEach(function () {
    const { ctx } = this.currentTest;
    if (ctx.fixture) fixture(ctx.fixture, ctx.fixtureOpts);
  });

  afterEach(function () {
    if (!this.currentTest.ctx.fixture) return;
    clearFixture();
  });
}

export function fixture (name, opts = {}) {
  const tpl = typeof name === 'function' ? name : FIXTURES[name] || (() => {});
  testBed().innerHTML = tpl(opts);
}

export function clearFixture () {
  const bed = testBed();
  while (bed.lastChild) {
    bed.removeChild(bed.lastChild);
  }
}

/**
 * fetches a value on an object or returns an alternative
 * @param  {Object} object
 * @param  {String} prop
 * @param  {[Mixed]} def default value
 * @return {Mixed} value of property on object or default if none found
 */
function fetch (object, prop, def = '') {
  // eslint-disable-next-line no-prototype-builtins
  return object.hasOwnProperty(prop) ? object[prop] : def;
}
