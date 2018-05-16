# teal-utils

## Consent
```js
(
  mappings: {
    [id: string]: string,
  },
) => Object
```
```js
import { consent } from '@team-griffin/uteals';
```
The consent module allows you to fetch and update the opt out preferences.

To create an optOut instance, call it with a mapping of category ids to aliases:
```js
const o = consent({
  0: 'default',
  c11: 'analytics',
});
```
This means you can reference the preferences by their aliases rather than their ids.

### get
```js
(
  categories?: Array<string>,
  consent: string,
) => {
  [id: string]: boolean,
}
```
Fetches the categories, with a boolean value to indicate whether the user has given consent for that option.
```js
o.get([ 'default' ], '0:1|c:0') // -> { default: true }
```

The categories list is optional, if you call `get` with no arguments, it will return *all* categories:
```js
o.get(null, '0:0|c:1'). // -> { default: true, analytics: false }
```

### set
```js
(
  categories: {
    [id: string]: boolean,
  },
  consent: string,
) => Fluture<void>;
```
Sets the consent flag for the given categories. Any categories not passed into this method will be preserved.

```js
o.set({
  default: false,
}, '0:1|c:0')
```

## Cookie Consent
```js
(
  mappings: {
    [id: string]: string,
  },
  cookieOptions?: Object,
) => Object
```
```js
import { cookieConsent } from '@team-griffin/uteals';
```
This variation fetches the consent data from a cookie rather than being passed in explicitly.

To create an instance, call it with a mapping of category ids to aliases:
```js
const o = cookieConsent({
  0: 'default',
  c11: 'analytics',
});
```
This means you can reference the preferences by their aliases rather than their ids.

### get
```js
(
  categories?: Array<string>,
) => Either<{
  [id: string]: boolean,
}>
```
Fetches the categories, with a boolean value to indicate whether the user has given consent for that option.
```js
o.get([ 'default' ]).either(console.error, console.log) // -> { default: true }
```

The categories list is optional, if you call `get` with no arguments, it will return *all* categories:
```js
o.get().either(console.error, console.log) // -> { default: true, analytics: false }
```

### set
```js
(
  categories: {
    [id: string]: boolean,
  },
) => Fluture<void>;
```
Sets the consent flag for the given categories. Any categories not passed into this method will be preserved.

```js
o.set({
  default: false,
}).either(console.error, console.log)
```
