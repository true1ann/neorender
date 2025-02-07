# NeoRender: docs/functions/INTERNAL-`nr.generateComponentId`.md
> [!CAUTION]  
> DO NOT rely on Interal APIs. Those are for ones who make custom forks of NeoRender, or rely on them for some reason. Remember: Internal APIs, unlike External, may change without a warning.

`nr.generateComponentId` is used to create an ID for a component.  

Since `verNum` 3, `afterCreate` (1) and `lazyLoad` (2) moved *outside* `nr.returnComponent()`, in `verNum` 3 it was fixed with a temporary solution: generate a random component ID (the `<div id="..."` tag).  

Since it was a temporary solution, now we have a proper function for this. IDs cannot repeat anymore, and are set as `<div data-nr-cid="...">`

## Example
```js
nr.generateComponentId(): string
```

## References
1. [`NeoRenderComponentConfig` type](../types/NeoRenderComponentConfig.md)
2. [`NeoRenderDynamicConfig` type](../types/NeoRenderDynamicConfig.md)

## Info
- Exists since `verNum` 4
- API since `verNum` 4