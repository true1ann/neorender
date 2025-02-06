# NeoRender: docs/functions/`nr.remount`.md
`nr.remount` is used to remount a component to a DOM element. Can be also used to replace 1 component with another.


## Example
```js
// Remount same component
nr.remount('#app', null);

// Swap previuos component with a new one
nr.remount('#app', 'my-component');
```

## Usage
```ts
nr.remount(string, string);
        // CSS Selector
                // Optional; With what component to swap with
```

## Info
- Exists since `verNum` 1
- API from `verNum` 1