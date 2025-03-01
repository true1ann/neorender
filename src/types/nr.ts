export interface NeoRenderComponentConfig {
  name: string,
  template: string,
  scopedStyles: string,
  beforeCreate: Function,
  main: Function,
  afterCreate: Function,
  beforeDelete: Function,
  lazyLoad: Function
}

export interface NeoRenderDynamicConfig {
  useShadowRoot: boolean,
  closeShadowRoot: boolean,
  mountConfig: {
    id: string | null,
    className: string | null
  },
  lazyLoad: boolean
}

export interface NeoRenderEnvConfig {
  type: string,
  mountingTo: string | null,
  cid: string | null
}

export interface NeoRenderPreComponent {
  context: HTMLDivElement,
  root: HTMLDivElement | ShadowRoot,
  config: NeoRenderDynamicConfig
  nr: {
    cid: string
  }
}