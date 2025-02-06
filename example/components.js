nr.defineComponent({
  name: 'TimeDisplay',
  template: '<div class="time"></div>',
  scopedStyles: `.time { color: red; font-size: 1.1em; }`,
  main: function (container, config, env) {
    function updateTime() {
      const now = new Date();
      container.querySelector('.time').textContent = now.toLocaleTimeString();
    };

    updateTime();
    setInterval(updateTime, 500);
    console.log('config:', config, 'env:', env)
  },
  beforeCreate: function (config, env) {
    console.log('I\'m getting created');
    if (env.type == 'mount') return { "mountConfig": { "id": "aaa" } }
    return { "useShadowRoot": false, "mountConfig": { "className": "aaa" } }
  },
  afterCreate: function () {
    console.log('I am created');
  },
  beforeDelete: function () {
    console.info('Im getting deleted')
  }
});

nr.defineComponent({
  name: 'LazyLoadTest',
  template: '<img style="height: 50vh">',
  lazyLoad: function (shadowRoot, config) {
    shadowRoot.querySelector('img').src = config
    console.log('lazyLoad triggered')
  }
})
