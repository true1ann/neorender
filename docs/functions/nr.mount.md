# NeoRender: docs/functions/`nr.mount`.md
`nr.mount` is used to mount a component to a DOM element.
> [!NOTE]  
> You cant mount more than 1 element on the same DOM element.

## Example
```js
nr.mount('my-component', '#app', null);
```

## Usage
```ts
nr.mount(string, string, any)
      // Component name
              // CSS Selector, determining where to mount
                      // User config (not edited at all)
```

## Info
- Exists since `verNum` 1
- API from `verNum` 1