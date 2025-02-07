# NeoRender: docs/types/`NeoRenderComponentConfig`.md
## Used in
- [`nr.defineComponent()`](../functions/nr.defineComponent.md)

## TypeScript type defenition
```ts
export interface NeoRenderComponentConfig {
  name: string,           // Defines the name of the component
  template: string,       // The HTML template of the component
  scopedStyles: string,   // CSS styles for your component
  beforeCreate: Function, // Function which can modify your dynamic configuration (1)
  main: Function,         // Main function which will execute in bypass of lazy loading
  afterCreate: Function,  // Function which will get executed after ensuring this.template and this.main are executed
  beforeDelete: Function, // This function will get called right before unmounting, note that you can't cancel unmount as of right now.
  lazyLoad: Function      // Main function which will execute once the component becomes visible
}
```

1. [See types/NeoRenderDynamicConfig](../types/NeoRenderDynamicConfig.md)

## Info
- Type from `verNum` 3
- Last updated in `verNum` 3