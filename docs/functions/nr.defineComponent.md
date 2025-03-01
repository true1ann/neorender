# NeoRender: docs/functions/`nr.defineComponent`.md

`nr.defineComponent` is used to define a new component in NeoRender.

## Example
```js
nr.defineComponent({
  name: 'TimeDisplay',
  template: '<div class="time"></div>',
  scopedStyles: `.time { color: red; font-size: 1.1em; }`,
  main: function (container, config) {
    function updateTime() {
      const now = new Date();
      container.querySelector('.time').textContent = now.toLocaleTimeString();
    };

    updateTime();
    setInterval(updateTime, 500);
    console.log('ive got this config:', config)
  },
  beforeCreate: function (config, env) {
    console.log('Im getting created');
    if (env.type == 'mount') {
      return { "mountConfig": { "id": "aaa" } }
    } else {
      return { "useShadowRoot": false, "mountConfig": { "className": "aaa" } }
    }
  },
  afterCreate: function () {
    console.log('I am created');
  },
  beforeDelete: function () {
    console.info('Im getting deleted');
  }
});
```

> [!WARNING]  
> After defining a component, you cannot do ANYTHING with it. Deletion and modifications are blocked

## Usage
```ts
nr.defineComponent(NeoRenderComponentConfig) // type (1)
                // Component config
```

## `beforeCreate`
Since `verNum` 2, you can use `beforeCreate` to modify some properties of your component before adding it to the page
```js
nr.defineComponent({
  ...
  beforeCreate(config, env) {
    if (env.type == "mount") {
      // By default use full lazyLoading
      return { lazyLoad: true } // (2)
    } else {
      // If using nr.scriptMount(), cancel lazyLoading
      return { lazyLoad: false } // (2)
    }
  }
  ...
});
```

## References
1. [`NeoRenderComponentConfig` type](../types/NeoRenderComponentConfig.md)
2. [`NeoRenderDynamicConfig` type](../types/NeoRenderDynamicConfig.md)

## Info
- Exists since `verNum` 1
- API from `verNum` 3