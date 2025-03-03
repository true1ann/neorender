# NeoRender: docs/functions/`nr.findComponentById`.md
> [!WARNING]  
> This feature is still under development

Used to reference a component by it's returned ID (since `verNum` X `nr.mount()` now returns that instead of the `cid`)
> [!TIP]  
> Not yet implemented

## Example
```js
nr.untilVisible(string): Promise<boolean>
             // CSS Selector
```

## Return
`HTMLDivElement`: the component's container
`boolean`: `false`: throws new Error

> [!TIP]
> To actually access component's ShadowRoot (component's template), use this example:
```js
const cid = ...
const component = nr.findComponentById(cid)
if (!component) {
  throw new Error(`Component with CID ${cid} was NOT found`)
}
const shadowRoot = component?.ShadowRoot
```

## Info 
- Exist since `verNum` 3
- API from `verNum` 3