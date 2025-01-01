# NeoRender

NeoRender is a lightweight rendering engine designed for web-based JavaScript projects. It aims to provide a component system, with plain JavaScript, and focused on optimization.

## Key Features:

* Lightweight: Minimal footprint with (almost) no unnecessary bloat.
* Dependency-Free: Operates without ***any*** external libraries, reducing potential conflicts and improving output file size.
* Declarative Syntax: Offers a clear way to define & use UI components.

# Verbs
0. 'NR'/'`nr`' - NeoRender
1. 'Component' - A Component is a package that includes Name, Template, JavaScript, and CSS code.
2. 'Element' - HTML's/Page's element (also is used as 'CSS Selector')
3. 'Selector' - CSS Selector for an Element
4. 'Method/Function' - Executable JavaScript code

# Definitions
## Non-methods/Non-functions
1. `nr.version:String` - Returns the current version of NeoRender (See 'Versioning system')
2. `nr.verNum:Integer` - Return the current version of NeoRender, but as an Integer (See 'Versioning system')
2. `nr.components:Object` - Returns all defined Components, including their Template, ScopedStyles, Main, and Lifecycles
3. `nr.mountedComponents:Object` - Returns all mounted Components and the Elements they are mounted to
> (Set as `nr.mountedComponents[SELECTOR] = <COMPONENTNAME>`)
4. `nr.lastWarn:String` - Returns the last NeoRender warning
5. `nr.lastError:String` - Returns the last NeoRender error

# Methods/Functions
## Warning
NR is implemented with plain JavaScript (No TypeScript), so types of supplied variables are ***NOT*** checked. Make sure you're supplying the right ones.
> Methods/Functions usually will return `true` or `false`. `true` means that NR completed the operation successfully, but does not guarantee that everything was executed as intended (usually Component's fault), `true` may also come with a warning, for example when unmounting something from an Element, which does not have any Component mounted to it. `false` means that an error has occurred, and that you should check `nr.lastError`.

1. `nr.defineComponent(componentConfig: Object): boolean` - Register a component, stored in `nr.components[componentConfig.name]`
> We will discuss componentConfig, but not now

2. `nr.mount(componentName: String; selector: String; config: Any, optional): boolean` - Mounts `nr.components[componentName]` to a `selector`. `config` is passed to `main` Method/Function of the component, and is NOT being processed in any way

3. `nr.scriptMount(componentName: String; config: Any): false | undefined` - Mounts a component, by replacing a `<script>`
> WARNING: `nr.scriptMount` IS ***NOT*** INTENDED FOR USE IN JAVASCRIPT FILES. RUN IT AS INLINE CODE IN A `<script>` TAG! CHECK `./example/index.html` FOR USAGE

4. `nr.remount(selector: String; componentName: String, optional): boolean` - Remounts `nr.components[componentName]` to current Element, or to `selector`, if such is defined.

5. `nr.unmount(selector: String): boolean` - Unmounts *any* mounted Component from `nr.mountedComponents[selector]`

## Warning#2
Next Methods/Functions are intended ***ONLY*** for development, testing and internal use by NR.

6. `nr.returnComponent(componentName: String; config: Any, optional): false | HTMLDivElement` - Returns full `HTMLDivElement` of `nr.components[componentName]`. `config` is passed to `main` Method/Function of the component, and is NOT being processed in any way

7. `nr.errorEvent(error: Error)` - Summon a NeoRender error
> Example: `nr.errorEvent(new Error('My custom error'));`

8. `nr.warnEvent(details: String)` - Summon a NeoRender warning
> Example: `nr.warnEvent('My custom warning');`

## Events
1. `neoRenderError` (Returns: `detail:Object - detail.message(nr.lastError):String; detail.stack:String`) - Last NeoRender Error

2. `neoRenderWarn` (Returns: `detail(nr.lastWarn):String`) - Last NeoRender warning
> You can check how to make `console.error||console.warn` events in `./example/index.html`

# `componentConfigs`, `beforeCreate`
`componentConfig` is: `name: String; template: String; scopedStyles: String, optional; beforeCreate: Method/Function, optional; main: Method/Function, optional; afterCreate: Method/Function, optional; beforeDelete: Method/Function, optional`. Refer to `./example/components/TimeDisplay.js` for an example of `componentConfig`
`beforeCreate`, since Sr2 it has a special use: it will recieve `config`, and `env` as arguments. `env` contains:
1. (verNum >= 2) type - either `mount` or `scriptMount`

`beforeCreate` can change these values:
1. (verNum >= 2) `useShadowRoot` (default: `true`) - Should the component use shadowRoot or not. If `scopedStyles` are defined and `useShadowRoot` is `false`, NeoRender will drop a warning'

2. (verNum >= 2) `closeShadowRoot` (default: `false`) - Should the shadowRoot be closed to external JavaScript, or not. Refer to [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow#mode) for exact side effects of closing it

3. (verNum >= 2) `scriptMountConfig` (default: `{ "id": undefined, "className": undefined }`) - defines some `scriptMount` config. You can set `scriptMountConfig.id` to set an ID (so you can access shadowRoot more easily for an instance), `scriptMountConfig.className` to set classes.
> To actually change those values, use `return { "useShadowRoot": false }`, as an example to disabling shadowRoot. and again, Refer to `./example/components/TimeDisplay.js` for an example.

# To-Dos & Current issues
> No issues reported yet, and the necessary methods/functions for my use are implemented. Suggest additions or report any issues to my Discord server. (see my website)

# Versioning system
Example: Sr2  
S - Means **S**table (Can be **A**lpha, **B**eta, **E**xperimental)  
r - Means release  
2 - Means number of the release  

# License
NeoRender is licensed under MIT license, check LICENSE file for details
