import assert from 'assert';
import { Checkout } from '../../lib/checkout';
import { initCheckout } from './support/helpers';

const sinon = window.sinon;

describe('Checkout.tax', function () {
  let checkout;

  const us = {
    country: 'US',
    postal_code: '94110'
  };
  const vat = {
    country: 'DE'
  };
  const none = {
    country: 'CA',
    postal_code: 'A1A 1A1'
  };

  beforeEach(() => checkout = initCheckout());

  it('requires a callback', function () {
    try {
      checkout.tax(us);
    } catch (e) {
      assert(~e.message.indexOf('callback'));
    }
  });

  it('requires Checkout.configure', function () {
    try {
      checkout = new Checkout();
      checkout.tax(us, () => {});
    } catch (e) {
      assert(~e.message.indexOf('configure'));
    }
  });

  describe('when given a taxable US postal code', function () {
    it('yields a tax type and rate', function (done) {
      checkout.tax(us, function (err, taxes) {
        var tax = taxes[0];
        assert(!err);
        assert(taxes.length === 1);
        assert(tax.type === 'us');
        assert(tax.rate === '0.0875');
        done();
      });
    });
  });

  describe('when given a taxable VAT country', function () {
    it('yields a tax type and rate', function (done) {
      checkout.tax(vat, function (err, taxes) {
        var tax = taxes[0];
        assert(!err);
        assert(taxes.length === 1);
        assert(tax.type === 'vat');
        assert(tax.rate === '0.015');
        done();
      });
    });
  });

  describe('when given a non-taxable country', function () {
    it('yields an empty array', function (done) {
      checkout.tax(none, function (err, taxes) {
        assert(!err);
        assert(taxes.length === 0);
        done();
      });
    });
  });

  describe('when given a non-taxable US postal code', function () {
    it('yields an empty array', function (done) {
      checkout.tax({
        country: 'US',
        postal_code: '70118'
      }, function (err, taxes) {
        assert(!err);
        assert(taxes.length === 0);
        done();
      });
    });
  });

  describe('when given a tax_code', function () {
    it('sends the tax_code', function (done) {
      var spy = sinon.spy(checkout.request, 'request');

      checkout.tax({
        country: 'US',
        postal_code: '70118',
        tax_code: 'digital'
      }, function (err) {
        assert(!err);
        assert(spy.calledOnce);
        assert(spy.calledWithMatch(sinon.match({ data: { tax_code: 'digital' } })));
        spy.restore();
        done();
      });
    });
  });

  describe('when given a vat_number', function () {
    it('sends the vat_number', function (done) {
      var spy = sinon.spy(checkout.request, 'request');

      checkout.tax({
        country: 'GB',
        vat_number: 'GB0000'
      }, function (err) {
        assert(!err);
        assert(spy.calledOnce);
        assert(spy.calledWithMatch(sinon.match({ data: { vat_number: 'GB0000' } })));
        spy.restore();
        done();
      });
    });
  });
});
