# NeoRender: docs/types/INTERNAL-`NeoRenderPreComponent`.md
## Used in
- [`nr.mount()`](../functions/nr.mount.md)
- [`nr.scriptMount()`](../functions/nr.scriptMount.md)

## TypeScript type defenition
```ts
export interface NeoRenderEnvConfig {
  type: string,              // Either 'mount' or 'scriptMount'
  mountingTo: string | null  // null when this.type is 'scriptMount'. Selector used in mount
}
```