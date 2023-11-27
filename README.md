# ivents <!-- omit in toc -->

![ivents.min.js](https://img.badgesize.io/nk-crew/ivents/master/dist/ivents.min.js?compression=gzip)

Helper functions for browser event listener

## Table of Contents <!-- omit in toc -->

- [Import ivents](#import-ivents)
  - [ESM](#esm)
  - [ESM CDN](#esm-cdn)
  - [UMD](#umd)
  - [UMD CDN](#umd-cdn)
  - [CJS (Bundlers like Webpack)](#cjs-bundlers-like-webpack)
- [Methods](#methods)
  - [on|one](#onone)
  - [off](#off)
  - [trigger](#trigger)
- [For Developers](#for-developers)

## Import ivents

Use one of the following examples to import script.

### ESM

We provide a version of ivents built as ESM (ivents.esm.js and ivents.esm.min.js) which allows you to use ivents as a module in your browser, if your [targeted browsers support it](https://caniuse.com/es6-module).

```html
<script type="module">
  import { on, off } from "ivents.esm.min.js";
</script>
```

### ESM CDN

```html
<script type="module">
  import { on, off } from "https://cdn.jsdelivr.net/npm/ivents@0.1/+esm";
</script>
```

### UMD

ivents may be also used in a traditional way by including script in HTML and using library by accessing `window.ivents`.

```html
<script src="ivents.min.js"></script>
```


### UMD CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ivents@0.1/dist/ivents.min.js"></script>
```

### CJS (Bundlers like Webpack)

Install ivents as a Node.js module using npm

```
npm install ivents
```

Import ivents by adding this line to your app's entry point (usually `index.js` or `app.js`):

```javascript
import { on, off } from 'ivents';
```

## Methods

### on|one

DOM event listener:

```javascript
import { on } from 'ivents';

on(document, 'click', (e) => {
  console.log('clicked', e);
});
```

Event listener with delegated target:

```javascript
import { on } from 'ivents';

on(document, 'click', '.custom-element-selector', (e) => {
  console.log('clicked', e);
});
```

Custom event listener with namespace:

```javascript
import { on } from 'ivents';

on(document, 'the-custom-event.with-namespace', (e) => {
  console.log('clicked', e);
});
```

### off

Remove DOM event listener:

```javascript
import { on } from 'ivents';

on(document, 'click', (e) => {
  console.log('clicked', e);
});

off(document, 'click');
```

Remove DOM event listener by namespace:

```javascript
import { on } from 'ivents';

on(document, 'click.my-namespace', (e) => {
  console.log('clicked', e);
});

off(document, '.my-namespace');
```

### trigger

Trigger event:

```javascript
import { trigger } from 'ivents';

trigger(document, 'click', (e) => {
  console.log('clicked', e);
});
```

## For Developers

### Installation <!-- omit in toc -->

* Run `npm install` in the command line. Or if you need to update some dependencies, run `npm update`

### Building <!-- omit in toc -->

* `npm run build` to run build

### Linting <!-- omit in toc -->

* `npm run js-lint` to show eslint errors
* `npm run js-lint-fix` to automatically fix some of the eslint errors
