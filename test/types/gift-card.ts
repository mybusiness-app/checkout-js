export default function giftCard () {
  window.checkout.giftCard({ code: 'basic' }, (error, giftCard) => {
    if (error) {
      error.message;
      error.code;
    } else {
      giftCard.currency;
      giftCard.unit_amount;
    }
  });

  // @ts-expect-error
  window.checkout.giftCard('basic', (error, giftCard) => {
    if (error) {
      error.message;
      error.code;
    } else {
      giftCard.currency;
      giftCard.unit_amount;
    }
  });
}
