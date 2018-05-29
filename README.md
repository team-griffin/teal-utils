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
) => string;
```
Sets the consent flag for the given categories. Any categories not passed into this method will be preserved.

```js
o.set({
  default: false,
}, '0:1|c:0')
```

### getByOrder
```js
(
  categories: Array<string>,
  consent: string,
) => {
  [category: string]: {
    id: string,
    value: boolean,
  },
}
```
If you don't know the ids of your categories, but you know the order they will be in, you can use this method to extract the ids and flags based purely on their order.

```js
const o = consent();

o.getByOrder([ 'default', 'analytics' ], '0:1|c:0') // { default: { id: '0', value: false }, analytics: { id: 'c', value: true }}
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
) => Maybe<{
  [id: string]: boolean,
}>
```
Fetches the categories, with a boolean value to indicate whether the user has given consent for that option.
```js
o.get([ 'default' ]).getOrElse() // -> { default: true }
```

The categories list is optional, if you call `get` with no arguments, it will return *all* categories:
```js
o.get().getOrElse() // -> { default: true, analytics: false }
```

### set
```js
(
  categories: {
    [id: string]: boolean,
  },
) => Maybe<string>;
```
Sets the consent flag for the given categories. Any categories not passed into this method will be preserved.

```js
o.set({
  default: false,
}).getOrElse()
```

### getByOrder
```js
(
  categories: Array<string>,
) => Maybe<{
  [category: string]: {
    id: string,
    value: boolean,
  },
}>
```
If you don't know the ids of your categories, but you know the order they will be in, you can use this method to extract the ids and flags based purely on their order.

```js
const o = consent();

o.getByOrder([ 'default', 'analytics' ]).getOrElse() // { default: { id: '0', value: false }, analytics: { id: 'c', value: true }}
```

## Identity Consent
```js
(
  mappings: {
    [id: string]: string,
  },
  consent: string,
) => Object
```
```js
import { identityConsent } from '@team-griffin/uteals';
```
This variation is very similar to the standard `consent` except that you can provide the consent string at instantiation time.

To create an instance, call it with a mapping of category ids to aliases:
```js
const o = identityConsent({
  0: 'default',
  c11: 'analytics',
}, '0:1|c:0');
```
This means you can reference the preferences by their aliases rather than their ids.

### get
```js
(
  categories?: Array<string>,
) => {
  [id: string]: boolean,
}
```
Fetches the categories, with a boolean value to indicate whether the user has given consent for that option.
```js
o.get([ 'default' ]) // -> { default: true }
```

The categories list is optional, if you call `get` with no arguments, it will return *all* categories:
```js
o.get() // -> { default: true, analytics: false }
```

### set
```js
(
  categories: {
    [id: string]: boolean,
  },
) => string;
```
Sets the consent flag for the given categories. Any categories not passed into this method will be preserved.

```js
o.set({
  default: false,
}).getOrElse()
```

### getByOrder
```js
(
  categories: Array<string>,
) => {
  [category: string]: {
    id: string,
    value: boolean,
  },
}
```
If you don't know the ids of your categories, but you know the order they will be in, you can use this method to extract the ids and flags based purely on their order.

```js
const o = consent();

o.getByOrder([ 'default', 'analytics' ]) // { default: { id: '0', value: false }, analytics: { id: 'c', value: true }}
```
