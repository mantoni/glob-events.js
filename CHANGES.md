# Changes

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
