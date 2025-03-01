import { isMainThread } from "worker_threads";
import { NeoRenderComponentConfig, NeoRenderDynamicConfig, NeoRenderEnvConfig, NeoRenderPreComponent} from "./types/nr";

declare global {
  interface Window {
    nr: typeof NeoRender;
  }
}

// TODO: refine error & warning messages
class NeoRender {
  static components: { [key: string]: NeoRenderComponentConfig } = {};
  static mountedComponents: { [key: string]: string } = {};
// TODO: ^^^^^^^^^^^^^^^^^ 
  // change this to NOT use an array and instead use [data-nr-mounted=true] and [data-nr-mounted-component-name=componentName]
  // to allow query selectors based on the mounted component with built-in document.querySelector(All)
  static componentSelectors: string[] = [];
  static version = 'NeoRender Br5';
  static verNum = 5;

  static defineComponent(config: NeoRenderComponentConfig) {
    try {
      if (!config.name || !config.template) {
        throw new Error('Components must have a Name and a Template.');
        return false;
      }
      this.components[config.name] = config;
      Object.freeze(this.components[config.name]);
      Object.defineProperty(this.components, config.name, {
        configurable: false
      });
      return true;
    } catch (err) {
      throw new Error(err as string);
      return false;
    }
  }

  static async untilVisible(selector: string): Promise<boolean> {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Element not found for selector: ${selector}`);
    }

    function isVisible(sel: string): boolean {
      const el = document.querySelector(sel) as HTMLElement;
      if (!el) return false
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && 
        style.visibility !== 'hidden' && 
        style.opacity !== '0'
    }
  
    return new Promise((resolve) => {
      const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            const checkVisibility = async () => {
              while (!isVisible(selector)) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
              resolve(true);
            };
            checkVisibility();
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

  static generateComponentId() {
    const generateId = (): string => {
      return [...Array(64)].map(() => 
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 62)]
      ).join("");
    };

    let id: string;
    do {
      id = generateId();
    } while (this.componentSelectors.includes(id));

    id = `NRCID_${id}`

    this.componentSelectors.push(id);
    return id;
  }

  static findComponentById(id: string) {
    return document.querySelector(`[data-nr-cid=${id}]`);
  }

  static async returnComponent(componentName: string, config: any, env: NeoRenderEnvConfig): Promise<NeoRenderPreComponent | false> {
    try {
      const component = this.components[componentName];
      if (!component) {
        throw new Error(`Component ${componentName} is not defined.`);
        return false;
      }

      const cid: string = this.generateComponentId()
      env.cid = cid;

      let componentConfig: NeoRenderDynamicConfig
      componentConfig = { 
        useShadowRoot: true, 
        closeShadowRoot: false, 
        mountConfig: { 
          id: null,
          className: null 
        }, 
        lazyLoad: false 
      }

      if (typeof component.beforeCreate === 'function') {
        const returnedConfig = component.beforeCreate(config, env);
        componentConfig = { ...componentConfig, ...returnedConfig };
      }

      if (componentConfig.lazyLoad) {
        if (env.mountingTo) {
          await this.untilVisible(env.mountingTo);
        } else {
          console.warn(`Component ${componentName} was probably mounted with nr.scriptMount(). Full lazyLoading IS NOT supported by nr.scriptMount()\nIf not, please leave an issue on GitHub`)
        }
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

      container.setAttribute('data-nr-cid', cid);
      return { context: componentRoot, config: componentConfig, root: container, nr: { cid: cid } } as NeoRenderPreComponent;
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
      const componentObj = await this.returnComponent(componentName, config, { type: "mount", mountingTo: selector, cid: null }) as NeoRenderPreComponent;

      if (componentObj) {
        element.appendChild(componentObj.root);
        this.mountedComponents[selector] = componentName;
      } else {
        throw new Error(`Failed to mount ${componentName}: nr.returnComponent() didnt return anything`)
      }

      if (typeof component.afterCreate === 'function') {
        component.afterCreate(this.findComponentById(componentObj.nr.cid)?.shadowRoot, config, { type: "mount", mountingTo: selector, cid: componentObj.nr.cid } as NeoRenderEnvConfig);
      }

      if (typeof component.lazyLoad == 'function' && componentObj) {
        await this.untilVisible(`[data-nr-cid=${componentObj.nr.cid}]`);
        component.lazyLoad(this.findComponentById(componentObj.nr.cid)?.shadowRoot, config, { type: "mount", mountingTo: selector, cid: componentObj.nr.cid } as NeoRenderEnvConfig)
      }

      return true
    } catch (err) {
      throw new Error(err as string);
      return false;
    }
  }

  static remount(selector: string, componentName: string) {
    try {
      this.unmount(selector);
      if (componentName) delete this.mountedComponents[selector]
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
            await component.beforeDelete(document.querySelector(`${selector} > div`)?.shadowRoot);
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

      const componentObj = await this.returnComponent(componentName, config, { type:"scriptMount", mountingTo: null } as NeoRenderEnvConfig) as NeoRenderPreComponent;

      if (scriptTag.parentNode && componentObj) {
        scriptTag.parentNode.replaceChild(componentObj.root, scriptTag);
      } else {
        throw new Error('Parent node of the script tag is null or componentObj is false.');
        return false;
      }

      if (typeof component.afterCreate === 'function') {
        component.afterCreate(this.findComponentById(componentObj.nr.cid)?.shadowRoot, config, { type:"scriptMount", mountingTo: null, cid: componentObj.nr.cid } as NeoRenderEnvConfig);
      }
      if (typeof component.lazyLoad === 'function') {
        await this.untilVisible(`[data-nr-cid=${componentObj.nr.cid}]`);
        component.lazyLoad(this.findComponentById(componentObj.nr.cid)?.shadowRoot, config, { type:"scriptMount", mountingTo: null, cid: componentObj.nr.cid } as NeoRenderEnvConfig);
      }
    } catch (err) {
      throw new Error(err as string);
    }
  }
}

window.nr = NeoRender;