export default function elementsToken () {
  const elements = window.checkout.Elements();
  const form = document.querySelector('form');

  if (!form) return;

  window.checkout.token(elements, form, (err, token) => {
    if (err) {
      err.message;
      err.code;
    } else {
      token.id;
      token.type;
      // @ts-expect-error
      token.fake;
    }
  });

  // @ts-expect-error
  window.checkout.token(form, elements, (err, token) => {
    if (err) {
      err.message;
      err.code;
    } else {
      token.id;
      token.type;
    }
  });
}
