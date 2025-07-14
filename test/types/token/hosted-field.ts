export default function hostedFieldToken () {
  const form = document.querySelector('form');

  if (form) {
    window.checkout.token(form, (err, token) => {
      if (err) {
        err.message;
        err.code;
      } else {
        token.id;
        token.type;
      }
    });
  }

  // @ts-expect-error
  window.checkout.token(document.querySelector('div'), () => {});

  // @ts-expect-error
  window.checkout.token((err, token) => {
    if (err) {
      err.message;
      err.code;
    } else {
      token.id;
      token.type;
    }
  });
}
