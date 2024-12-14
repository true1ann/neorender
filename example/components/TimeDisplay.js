const component = {
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
  beforeCreate: function () {
    console.log('I\'m getting created');
  },
  afterCreate: function () {
    console.log('I am created');
  },
  beforeDelete: function () {
    console.info('Im getting deleted')
  }
}
nr.defineComponent(component);