# NeoRender: docs/functions/INTERNAL-`nr.returnComponent`.md
> [!CAUTION]  
> DO NOT rely on Interal APIs. Those are for ones who make custom forks of NeoRender, or rely on them for some reason. Remember: Internal APIs, unlike External, may change without a warning.

`nr.returnComponent` is `await`ed until the component appears in the viewport

## Example
```js
nr.untilVisible(string): Promise<boolean>
             // CSS Selector
```

## Return
`boolean`: `true`: component appeared on the viewwport  
`boolean`: `false`: throws new Error