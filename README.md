# glob-events.js

[![Build Status]](https://travis-ci.org/mantoni/glob-events.js)
[![SemVer]](http://semver.org)
[![License]](https://github.com/mantoni/glob-events.js/blob/master/LICENSE)

Event emitter with glob support on event names, for node and the browser

## Features

- Node.js [EventEmitter][] compatible API
- Register listeners with glob event names (`*` and `**`)
- Emit events with glob event names (`*` and `**`)
- 100% test coverage

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

## API

- `Emitter([opts])`: Constructor function, accepting these options:
    - `reverse`: Whether to invoke listeners in reverse insertion order.
      Defaults to `false`.
    - `addEvent`: The event to fire when new listeners are added. Defaults to
      `"newListener"`.
    - `removeEvent`: The event to fire when listeners are removed. Defaults to
      `"removeListener"`.
- `toScope(args)`: Converts the given arguments array into a scope object that
  can be used with `invoke`.

The constructor `opts` are passed to the [glob-store][] constructor.

## Emitter API

- `emit(event[, ...])`: Invokes all listeners registered for the given event
  with the optional arguments. Matching rules are applied on the event name as
  descibed in the [glob-tree match expressions][].
- `addListener(event, fn)` / `on(event, fn)`: Registers a listener for an event
- `once(event, fn)`: Registers a listener for an event that is automatically
  removed on the first invocation
- `removeListener(event, fn)`: Unregisteres a listener for an event
- `removeAllListeners([event])`: Unregisters all listeners, or all listeners
  for the given event. Matching rules are not applied.
- `removeMatchingListeners(event)`: Unregisters all listeners matching the
  given event name as described in the [glob-tree match expressions][].
- `listeners([event][, options])`: Returns all listeners, or all listeners
  for the given event. Matching rules are applied on the event name as
  described in the [glob-tree match expressions][].
- `iterator([event][, options])`: Exposes the iterator used to retrieve all
  listeners, or all listeners for a given event. Each iterator entry has these
  properties:
    - `event`: The event name that was used to register the function
    - `fn`: The registered function. Note: When using `once`, this
      is not the same as the registered function.
    - `orig`: The original registered function, only available for
      entries that where added with `once`.
    - `scope`: The scopr to use when invoking the function.
- `invoke(iterator, scope)`: Invokes the functions returned by an iterator on
  the given `scope` with the arguments from `scope.args`. This function is
  internally used by `emit`.

### Options

The `options` argument can have these properties:

- `matchers`: Emit to matchers, defaults to `true`
- `listeners`: Emit to listeners, defaults to `true`

The first argument passed to `emit` can be an object with an `event` property
and any of the above options.

### Scope

Listeners are invoked with a special scope object. If an object is passed to
`emit` as the event (see Options), that object is used as the scope object.
In addition, the arguments array is exposed via `this.args`.

It is also possible to bind individual listeners to specific scope objects:

```js
emitter.addListener({
  event : 'some.event',
  scope : this
}, function () { ... });
```

### Events

- `newListener`: Emitted by `addListener`, `on` and `once` with the event name
  and the new listener function. Matchers will not receive this event.
- `removeListener`: Emitted by `removeListener` and `removeAllListeners` with
  the event name and the removed listener function. Matchers will not receive
  this event.
- `error`: Emitted by `emit` if a listener throws an exception. The only
  argument is the caught exception. The original event's scope is exposed on
  `this.cause`  with these properties:
    - `event`: The event that caused the exception
    - `fn`: The function that threw the exception
    - `scope`: The scope the function was executed with
    - `args`: The arguments that where passed to the function

## TODO

- setMaxListeners(n)

## License

MIT

[Build Status]: http://img.shields.io/travis/mantoni/glob-events.js.svg
[SemVer]: http://img.shields.io/:semver-%E2%9C%93-brightgreen.svg
[License]: http://img.shields.io/npm/l/glob-events.svg
[EventEmitter]: http://nodejs.org/api/events.html
[glob-store]: https://github.com/mantoni/glob-store.js
[glob-tree match expressions]: https://github.com/mantoni/glob-tree.js#match-expressions
