# NeoRender: docs/types/INTERNAL-`NeoRenderPreComponent`.md
> [!CAUTION]  
> DO NOT rely on Interal APIs. Those are for ones who make custom forks of NeoRender, or rely on them for some reason. Remember: Internal APIs, unlike External, may change without a warning.

## TypeScript type defenition
```ts
export interface NeoRenderPreComponent {
  context: HTMLDivElement | ShadowRoot, // Context
  root: HTMLDivElement,                 // Contains renderred NeoRenderComponentConfig.template (1)
  config: NeoRenderDynamicConfig        // NeoRenderDynamicConfig (2)
  nr: {
    cid: string                         // Component ID
  }
}
```

## References
1. [`NeoRenderComponentConfig` type](../types/NeoRenderComponentConfig.md)
2. [`NeoRenderDynamicConfig` type](../types/NeoRenderDynamicConfig.md)

## Info
- Type from `verNum` 3
- Last updated in `verNum` 4