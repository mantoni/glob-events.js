# glob-events.js [![Build Status](https://travis-ci.org/mantoni/glob-events.js.png?branch=master)](http://travis-ci.org/mantoni/glob-events.js)

Event emitter with glob support on event names, for node and the browser

Repository: <https://github.com/mantoni/glob-events.js>

---

## Install with npm

```
npm install glob-events
```

## Browser support

Use [Browserify](http://browserify.org) to create a standalone file.

## Usage

```js
var Emitter = require('glob-events').Emitter;
var emitter = new Emitter();
```

## Emitter API

- `emit(event[, ...])`
- `addListener(event, fn)`
- `removeListener(event, fn)`
- `listeners([event][, options])`

## License

MIT
