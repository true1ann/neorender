# NeoRender: docs/staticVariables.md
Following variables are oftenly used in Docs, such as `verNum`

- `nr.components`: Array, holds all defined components
> [!NOTE]  
> `nr.mountedComponents > 'componentName': 'NeoRenderComponentConfig'` (type)
- `nr.mountedComponents`: Array, holds mounted components
> [!NOTE]  
> `nr.mountedComponents > 'selector': 'component'`
- `nr.version`: string, holds full version (`NeoRender XrY`, see [Versioning](versioning.md))
- `nr.verNum`: Number, holds release number

> [!WARNING]  
> Internal
- `nr.componentSelectors`: Array, holds CIDs