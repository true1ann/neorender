import { isMainThread } from "worker_threads";
import { NeoRenderComponentConfig, NeoRenderDynamicConfig, NeoRenderEnvConfig, NeoRenderPreComponent} from "./types/nr";

declare global {
  interface Window {
    nr: typeof NeoRender;
  }
}

class NeoRender {
  static components: { [key: string]: NeoRenderComponentConfig } = {};
  static mountedComponents: { [key: string]: string } = {};
  static version = 'NeoRender Sr3';
  static verNum = 3;

  static defineComponent(config: NeoRenderComponentConfig) {
    try {
      if (!config.name || !config.template) {
        throw new Error('Components must have a Name and a Template.');
        return false;
      }
      this.components[config.name] = config;
      return true;
    } catch (err) {
      throw new Error(err as string);
      return false;
    }
  }

  static untilVisible(selector: string): Promise<boolean> {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element not found for selector: ${selector}`);
        resolve(false);
        return;
      }
  
      const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            resolve(true);
          }
        });
      }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      });
  
      observer.observe(element);
    });
  }
  

  static async returnComponent(componentName: string, config: any, env: NeoRenderEnvConfig): Promise<NeoRenderPreComponent | false> {
    try {
      const component = this.components[componentName];
      if (!component) {
        throw new Error(`Component ${componentName} is not defined.`);
        return false;
      }

      let componentConfig: NeoRenderDynamicConfig
      componentConfig = { 
        "useShadowRoot": true, 
        "closeShadowRoot": false, 
        "mountConfig": { 
          "id": `nr_${[...Array(64)].map(() => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.random() * 62 | 0]).join("")}`,
          "className": null 
        }, 
        "lazyLoad": false 
      }

      if (typeof component.beforeCreate === 'function') {
        const returnedConfig = component.beforeCreate(config, env);
        componentConfig = { ...componentConfig, ...returnedConfig };
      }

      const container = document.createElement('div');
      let componentRoot: ShadowRoot | HTMLDivElement

      if (componentConfig.useShadowRoot) {
        componentRoot = container.attachShadow({ mode: componentConfig.closeShadowRoot ? 'closed' : 'open' });
      } else {
        componentRoot = container
      }

      if (typeof componentConfig.mountConfig.id == 'string') container.id = componentConfig.mountConfig.id;
      if (typeof componentConfig.mountConfig.className == 'string') container.className = componentConfig.mountConfig.className;

      componentRoot.innerHTML = component.template;

      if (component.scopedStyles) {
        if (componentConfig.useShadowRoot) {
          const styleElement = document.createElement('style');
          styleElement.textContent = component.scopedStyles;
          componentRoot.appendChild(styleElement);
        } else {
          console.warn(`Component "${component.name}" has scopedStyles, but shadowRoot is disabled. scopedStyles will be ignored.`);
        }
      }

      if (typeof component.main === 'function') {
        component.main(componentRoot, config, env);
      }

      return { context: componentRoot, config: componentConfig, root: container } as NeoRenderPreComponent;
    } catch (err) {
      throw new Error(err as string);
      return false;
    }
  }

  static async mount(componentName: string, selector: string, config: any) {
    try {
      const component = this.components[componentName];
      if (!component) {
        throw new Error(`Component ${componentName} is not defined.`);
        return false;
      }

      const element = document.querySelector(selector);
      if (!element) {
        throw new Error(`Element ${element} is not found.`);
        return false;
      }

      if (this.mountedComponents[selector]) {
        if (this.mountedComponents[selector] === componentName) {
          console.warn(`Component ${this.mountedComponents[selector]} is already mounted to ${selector}`);
          return true;
        }
        throw new Error(`Element ${selector} already has a component mounted to it: ${this.mountedComponents[selector]}`);
        return false;
      }
      
      const componentObj = await this.returnComponent(componentName, config, {"type":"mount", "mountingTo": selector}) as NeoRenderPreComponent;

      if (componentObj) {
        if (componentObj.config.lazyLoad) await this.untilVisible(selector);
        element.appendChild(componentObj.root);
        this.mountedComponents[selector] = componentName;
      } else {
        throw new Error(`Failed to mount ${componentName}: nr.returnComponent() didnt return anything`)
      }

      if (typeof component.afterCreate === 'function') {
        component.afterCreate(document.querySelector(`#${componentObj.config.mountConfig.id }` || selector + ' > div')?.shadowRoot, config, {"type":"mount", "mountingTo": selector});
      }

      if (typeof component.lazyLoad == 'function' && componentObj) {
        await this.untilVisible(`#${componentObj.config.mountConfig.id }` || selector + ' > div');
        component.lazyLoad(document.querySelector(`#${componentObj.config.mountConfig.id }` || selector + ' > div')?.shadowRoot, config, {"type":"mount", "mountingTo": selector})
      }

      return true
    } catch (err) {
      throw new Error(err as string);
      return false;
    }
  }

  static remount(selector: string, componentName: string) {
    try {
      const element = document.querySelector(selector);
      if (element) {
        element.innerHTML = '';
      } else {
        throw new Error(`Element ${selector} is not found.`);
        return false;
      }
      if (componentName) {
        delete this.mountedComponents[selector]
      }
      return this.mount(componentName || this.mountedComponents[selector], selector, null);
    } catch (err) {
      throw new Error(err as string);
      return false;
    }
  }

  static async unmount(selector: string) {
    try {
      const componentName = this.mountedComponents[selector];
      if (componentName) {
        const component = this.components[componentName];
        if (typeof component.beforeDelete === 'function') {
          await component.beforeDelete.call(null);
        }
        const element = document.querySelector(selector);
        if (element) {
          element.innerHTML = '';
        }
        delete this.mountedComponents[selector];
        return true;
      } else {
        console.warn(`Tried to unmount NR from ${selector}, but nothing was mounted to it.`);
        return true;
      }
    } catch (err) {
      throw new Error(err as string);
      return false;
    }
  }

  static async scriptMount(componentName: string, config: Record<string, any>) {
    try {
      const scriptTag = document.currentScript;
      if (!scriptTag) {
        throw new Error(`scriptMount is NOT meant to be executed in script, or console. use mount or returnComponent instead.`);
        return false;
      }

      const component = this.components[componentName];
      if (!component) {
        throw new Error(`Component ${componentName} is not defined.`);
        return false;
      }

      const componentObj = await this.returnComponent(componentName, config, {"type":"scriptMount", "mountingTo": null} as NeoRenderEnvConfig) as NeoRenderPreComponent;

      if (componentObj && componentObj.config.lazyLoad) {
        console.warn(`Component ${componentName} tried to use full lazyLoading. it is NOT supported by nr.scriptMount`);
      }

      if (scriptTag.parentNode && componentObj) {
        scriptTag.parentNode.replaceChild(componentObj.root, scriptTag);
      } else {
        throw new Error('Parent node of the script tag is null or componentObj is false.');
        return false;
      }

      if (typeof component.afterCreate === 'function') {
        component.afterCreate(document.querySelector(`#${componentObj.config.mountConfig.id }`)?.shadowRoot, config, {"type":"scriptMount", "mountingTo": undefined});
      }
      if (typeof component.lazyLoad === 'function') {
        if (componentObj.config.mountConfig.id) {
          await this.untilVisible(componentObj.config.mountConfig.id);
          component.lazyLoad(document.querySelector(`#${componentObj.config.mountConfig.id }`)?.shadowRoot, config, {"type":"scriptMount", "mountingTo": undefined});
        } else {
          console.warn(`Component ${componentName} has lazyLoad(), but doesn't have an beforeCreate().mountConfig.id.`);
        }
      }
    } catch (err) {
      throw new Error(err as string);
    }
  }
}

window.nr = NeoRender;
