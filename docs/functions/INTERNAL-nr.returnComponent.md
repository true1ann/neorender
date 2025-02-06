# NeoRender: docs/functions/INTERNAL-`nr.returnComponent`.md
> [!CAUTION]  
> DO NOT rely on Interal APIs. Those are for ones who make custom forks of NeoRender, or rely on them for some reason. Remember: Internal APIs, unlike External, may change without a warning.

`nr.returnComponent` is used to pre-process a component.

## Example
```js
nr.returnComponent(string, any, NeoRenderEnvConfig): Promise<NeoRenderPreComponent | false> // (3) (4)
                // Component name
                        // User config (not changed at all)
```

## References
3. [`NeoRenderEnvConfig` (type)](../types/NeoRenderEnvConfig.md)
4. [`NeoRenderPreComponent` (INTERNAL, type)](../types/INTERNAL-NeoRenderPreComponent.md)