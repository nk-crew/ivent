# ivent <!-- omit in toc -->

![ivent.min.js](https://img.badgesize.io/nk-crew/ivent/master/dist/ivent.min.js?compression=gzip)

Helper functions for browser event listener

## Table of Contents <!-- omit in toc -->

- [Import ivent](#import-ivent)
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

## Import ivent

Use one of the following examples to import script.

### ESM

We provide a version of ivent built as ESM (ivent.esm.js and ivent.esm.min.js) which allows you to use ivent as a module in your browser, if your [targeted browsers support it](https://caniuse.com/es6-module).

```html
<script type="module">
  import { on, off } from "ivent.esm.min.js";
</script>
```

### ESM CDN

```html
<script type="module">
  import { on, off } from "https://cdn.jsdelivr.net/npm/ivent@0.1/+esm";
</script>
```

### UMD

ivent may be also used in a traditional way by including script in HTML and using library by accessing `window.ivent`.

```html
<script src="ivent.min.js"></script>
```


### UMD CDN

```html
<script src="https://cdn.jsdelivr.net/npm/ivent@0.1/dist/ivent.min.js"></script>
```

### CJS (Bundlers like Webpack)

Install ivent as a Node.js module using npm

```
npm install ivent
```

Import ivent by adding this line to your app's entry point (usually `index.js` or `app.js`):

```javascript
import { on, off } from 'ivent';
```

## Methods

### on|one

DOM event listener:

```javascript
import { on } from 'ivent';

on(document, 'click', (e) => {
  console.log('clicked', e);
});
```

Event listener with delegated target:

```javascript
import { on } from 'ivent';

on(document, 'click', '.custom-element-selector', (e) => {
  console.log('clicked', e);
});
```

Custom event listener with namespace:

```javascript
import { on } from 'ivent';

on(document, 'the-custom-event.with-namespace', (e) => {
  console.log('clicked', e);
});
```

### off

Remove DOM event listener:

```javascript
import { on } from 'ivent';

on(document, 'click', (e) => {
  console.log('clicked', e);
});

off(document, 'click');
```

Remove DOM event listener by namespace:

```javascript
import { on } from 'ivent';

on(document, 'click.my-namespace', (e) => {
  console.log('clicked', e);
});

off(document, '.my-namespace');
```

### trigger

Trigger event:

```javascript
import { trigger } from 'ivent';

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
