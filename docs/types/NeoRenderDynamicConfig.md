# NeoRender: docs/types/`NeoRenderDynamicConfig`.md
## Used in
- [`NeoRenderComponentConfig` (type)](../types/NeoRenderComponentConfig.md)

## TypeScript type defenition
```ts
export interface NeoRenderDynamicConfig {
  useShadowRoot: boolean,    // Default: true, If disabled, shadowRoot will get replaced by a <div> element. scopedStyles wwill be disabled
  closeShadowRoot: boolean,  // Default: false, Should we close shadowRoot from external JavaScript
  mountConfig: {
    id: string | null,       // Default: null, ID of the container (shadowRoot | <div>)
    className: string | null // Default: null, className (classes) of the container (shadowRoot | <div>)
  },
  lazyLoad: boolean          // Default: false, Should entire component wait before loading *into the DOM* only after user scrolls onto the parent element?
  // ^ Note: works only on nr.mount()
}
```

## Info
- Type from `verNum` 3
- Last updated in `verNum` 3