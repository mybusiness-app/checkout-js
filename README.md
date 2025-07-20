<p align="center">
  <img src="http://i.imgur.com/7s94rRK.png">
  <br>
  <img src="https://i.imgur.com/768rLjE.gif">
</p>

[![Continuous Integration][github-actions-ci-image]][github-actions-ci-url]
[![Browser test status][browserstack-image]][browserstack-url]
[![coverage][coverage-image]][coverage-url]

## Documentation

[Getting Started & API Documentation][docs]

## Examples

See our [Examples Repo][examples] for example client-side and server-side
implementations.

## Installation

```html
<script src="https://js.mybusinessapp.co.za/v4/checkout.js"></script>
```

**Important:** Please do not host checkout.js or bundle it using a package manager. In order to ensure you always run the most stable and secure version possible, you must load checkout.js from our CDN.

## Build
Development build server
```bash
docker compose up
```

If you are having issues with the build, try `make clean`.

## Test

```bash
$ make test
```

To run a single test or test group, use mocha's `.only` syntax.

## License

[MIT][license]

[*aurea mediocritas*][aristotle]

[climate-url]: https://codeclimate.com/github/mybusinessapp/checkout-js
[climate-image]: http://img.shields.io/codeclimate/github/mybusinessapp/checkout-js.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/mybusinessapp/checkout-js
[coverage-image]: https://img.shields.io/coveralls/github/mybusinessapp/checkout-js.svg?style=flat-square
[browserstack-url]: https://automate.browserstack.com/public-build/MDJrZjliTlUvTjkzVGFzZ2ZpT1FHZ011aS9RUS9QQXE2ZlBZNUZJWWRGND0tLUcwbzUxYUF3QUt6dnM5aHJBb0lWNWc9PQ==--e8dfaeba4b9697fa5fc4ee5e245d44e5d9ad9d99%
[browserstack-image]: https://automate.browserstack.com/badge.svg?badge_key=MDJrZjliTlUvTjkzVGFzZ2ZpT1FHZ011aS9RUS9QQXE2ZlBZNUZJWWRGND0tLUcwbzUxYUF3QUt6dnM5aHJBb0lWNWc9PQ==--e8dfaeba4b9697fa5fc4ee5e245d44e5d9ad9d99%
[github-actions-ci-image]: https://github.com/mybusiness-app/checkout-js/actions/workflows/ci.yaml/badge.svg
[github-actions-ci-url]: https://github.com/mybusiness-app/checkout-js/actions/workflows/ci.yaml

[docs]: https://developers.mybusinessapp.co.za/pages/checkout-js.html
[examples]: https://github.com/mybusinessapp/checkout-js-examples
[component]: http://github.com/component/component
[license]: LICENSE.md
[aristotle]: https://en.wikipedia.org/wiki/Golden_mean_(philosophy)
