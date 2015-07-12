# Changes

## 1.4.0

- Allow to configure `internalEvents`
- Add `isInternalEvent(event)`
- Treat "error" events as internal

## 1.3.0

- Expose `emitter` in scope
- Fix `removeMatchingListeners` to not remove "removeListener" too early

## 1.2.1

- Do not change aritiy of added once listener

## 1.2.0

- Add `removeMatchingListeners(event)`
- Only emit remove event in `removeAllListeners` for exact matches

## 1.1.1

- Retain custom args property in `toScope`
- Prefer arguments over `scope.args` in `toScope`
- Expose `args` on listener scope object

## 1.1.0

- Add support for custom "add" and "remove" events
- Add `event` name to objects that are returned by iterators
- Add `fn` and actual `scope` to `this.cause` for error events
- Split `emit` into `toScope(args)` and `invoke(iterator, scope)`
- Reuse `iterator` function in `emit`
- Do not invoke "newListner" and "removeListener" functions for `*` event

## 1.0.0

- Use `glob-store` 1.0
- Support config objects for listener registration with custom scope
- Move util into fixture to work around a browserify issue
- Pass `opts` to `glob-store`
- Do not emit "remove" events if there is nothing to remove
- Throw if "error" event is emitted and and there are no listeners
- Simplify build process with Mochify
- Run tests in real browsers with SauceLabs

## 0.6.0

- Invoke `'error'` listener if there was an exception
- Make sure all listeners are invoked if one is throwing

## 0.5.0

- Expose iterator used to retrieve listeners

## 0.4.1

- Invoke once listener with scope object

## 0.4.0

- Pass on given event object as scope
- Expose event name on scope
- Expose args on scope
- Expose given options on scope

## 0.3.0

- Support event object with options to disable `matchers` and `listeners`
- Changed `listeners` options to use the same flags as the event object
- Added `once`
- Emitting 'newListener' in `addListener`, `on` and `once`
- Emitting 'removeListener' in `removeListener` and `removeAllListeners`
- Bugfixes

## 0.2.0

- Added `on`
- Added `removeAllListeners`

## 0.1.0

- Initial release
