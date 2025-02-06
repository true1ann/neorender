# NeoRender: docs/functions/`nr.scriptMount`.md
`nr.scriptMount` allows mounting components directly via a `<script>` tag. Useful when defining in HTML

## Example
```html
<script async>
  nr.scriptMount('my-component', null);
</script>
```

## Usage
```ts
nr.scriptMount(string, any);
            // Component Name
                    // User config (not changed at all)
```

> [!NOTE]  
> `<script>` gets replaced by component, not appended from top/bottom.

## Info
- Exists since `verNum` 1
- API from `verNum` 1