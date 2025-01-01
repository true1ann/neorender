class NeoRender {
  static components = {};
  static mountedComponents = {};
  static version = 'NeoRender Sr2';
  static verNum = 2;
  static lastError = null;
  static lastWarn = null;

  static errorEvent(error) {
    const message = error instanceof Error ? error.message : error;
    const stack = error instanceof Error ? error.stack : null;
    this.lastError = message;

    const eventDetail = {
      message: this.lastError,
      stack: stack,
    };

    const event = new CustomEvent('neoRenderError', { detail: eventDetail });
    window.dispatchEvent(event);
  }

  static warnEvent(message) {
    this.lastWarn = message;
    const event = new CustomEvent('neoRenderWarn', { detail: this.lastWarn });
    window.dispatchEvent(event);
  }

  static defineComponent(config) {
    try {
      if (!config.name || !config.template) {
        this.errorEvent(new Error('Components must have a Name and a Template.'));
        return false;
      }
      this.components[config.name] = config;
      return true;
    } catch (error) {
      this.errorEvent(error);
      return false;
    }
  }

  static returnComponent(componentName, config, env) {
    try {
      const component = this.components[componentName];
      if (!component) {
        this.errorEvent(new Error(`Component ${componentName} is not defined.`));
        return false;
      }

      let componentConfig = { "useShadowRoot": true, "closeShadowRoot": false, "mountConfig": { "id": undefined, "className": undefined } }
      if (typeof component.beforeCreate === 'function') {
        const returnedConfig = component.beforeCreate(config, env);
        componentConfig = { ...componentConfig, ...returnedConfig };
      }

      let componentRoot
      const container = document.createElement('div');
      if (componentConfig.useShadowRoot) {
        componentRoot = container.attachShadow({ mode: componentConfig.closeShadowRoot ? 'closed' : 'open' });
      } else {
        componentRoot = container;
      }

      if (componentConfig.mountConfig.id) container.id = componentConfig.mountConfig.id;
      if (componentConfig.mountConfig.className) container.className = componentConfig.mountConfig.className;

      componentRoot.innerHTML = component.template;

      if (component.scopedStyles && componentConfig.useShadowRoot) {
        const styleElement = document.createElement('style');
        styleElement.textContent = component.scopedStyles;
        componentRoot.appendChild(styleElement);
      }
      if (component.scopedStyles && !componentConfig.useShadowRoot) this.warnEvent(`Component "${component.name}" has scopedStyles, but shadowRoot is disabled. scopedStyles will be ignored.`);

      if (typeof component.main === 'function') {
        component.main(componentRoot, config);
      }

      if (typeof component.afterCreate === 'function') {
        component.afterCreate(componentRoot, config);
      }

      return container;
    } catch (error) {
      this.errorEvent(error);
      return false;
    }
  }

  static async mount(componentName, selector, config) {
    try {
      const component = this.components[componentName];
      if (!component) {
        this.errorEvent(new Error(`Component ${componentName} is not defined.`));
        return false;
      }

      const element = document.querySelector(selector);
      if (!element) {
        this.errorEvent(new Error(`Element ${element} is not found.`));
        return false;
      }

      if (this.mountedComponents[selector]) {
        if (this.mountedComponents[selector] === componentName) {
          this.warnEvent(`Component ${this.mountedComponents[selector]} is already mounted to ${selector}`);
          return true;
        }
        this.errorEvent(new Error(`Element ${selector} already has a component mounted to it: ${this.mountedComponents[selector]}`));
        return false;
      }
      element.appendChild(await this.returnComponent(componentName, config, {"type":"mount"}));
      this.mountedComponents[selector] = componentName;
      return true
    } catch (error) {
      this.errorEvent(error);
      return false;
    }
  }

  static remount(selector, componentName) {
    try {
      document.querySelector(selector).innerHTML = '';
      return this.mount(componentName || this.mountedComponents[selector], selector);
    } catch (error) {
      this.errorEvent(error);
      return false;
    }
  }

  static async unmount(selector) {
    try {
      const componentName = this.mountedComponents[selector];
      if (componentName) {
        const component = this.components[componentName];
        if (typeof component.beforeDelete === 'function') {
          await component.beforeDelete.call(null);
        }
        document.querySelector(selector).innerHTML = '';
        delete this.mountedComponents[selector];
        return true;
      } else {
        this.warnEvent(`Tried to unmount NR from ${selector}, but nothing was mounted to it.`);
        return true;
      }
    } catch (error) {
      this.errorEvent(error);
      return false;
    }
  }

  static async scriptMount(componentName, config) {
    try {
      const scriptTag = document.currentScript;
      if (!scriptTag) {
        this.errorEvent(new Error(`scriptMount is NOT meant to be executed in script, or console. use mount/returnComponent instead.`));
        return false
      }
      const container = await this.returnComponent(componentName, config, {"type":"scriptMount"});
      scriptTag.parentNode.replaceChild(container, scriptTag);
    } catch (error) {
      this.errorEvent(error);
    }
  }
}

window.nr = NeoRender;
