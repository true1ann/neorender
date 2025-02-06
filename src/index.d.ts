import { NeoRenderComponentConfig, NeoRenderDynamicConfig, NeoRenderEnvConfig, NeoRenderPreComponent } from "./types/nr";

declare global {
  interface Window {
    nr: typeof NeoRender;
  }
}

declare class NeoRender {
  static components: { [key: string]: NeoRenderComponentConfig };
  static mountedComponents: { [key: string]: string };
  static version: string;
  static verNum: number;

  static defineComponent(config: NeoRenderComponentConfig): boolean;
  static untilVisible(selector: string): Promise<boolean>;
  static returnComponent(componentName: string, config: any, env: NeoRenderEnvConfig): Promise<NeoRenderPreComponent | false>;
  static mount(componentName: string, selector: string, config: any): Promise<boolean>;
  static remount(selector: string, componentName: string): Promise<boolean>;
  static unmount(selector: string): Promise<boolean>;
  static scriptMount(componentName: string, config: Record<string, any>): Promise<void>;
}

export = NeoRender;
export as namespace NeoRender;
