import { Model } from './Model'
import { compile, registerHelper } from 'handlebars'
import { isObjectEmpty, isArrayEmpty } from '../lib'
import { paramCase } from 'param-case'
import cheerio from 'cheerio'

export type CompileFunc = (props?: Array<any>) => string

// registerHelper('component', (component: Component, ...args) => {
//   let props = []
//   if (!isArrayEmpty(component.props)) {
//     for (let i = 0; i < args.length - 1; i++) {
//       props.push(new Prop(component.props[i], args[i]))
//     }
//   }
//   return component.compile(props)
// })

interface Configuration {
  name: string
  model?: Record<string, Component>
  components?: Record<string, Component>
  props?: string[]
}

export class Component {
  source: string
  model: Model = new Model({})
  components: Record<string, Component> = {}
  constructor(source: string, configuration?: Configuration) {
    // Set the source
    this.source = source
    // Set the models
    if (!isObjectEmpty(configuration?.model)) {
      for (const [k, v] of Object.entries(configuration.model)) {
        this.model.context[k] = v
      }
    }
    // Set the child components.
    if (!isObjectEmpty(configuration?.components)) {
      for (const [k, v] of Object.entries(configuration.components)) {
        this.components[paramCase(k)] = v
      }
    }
  }
  /**
   *
   * @param {Prop[]} props optional
   * @returns {string}
   */
  compile(props?: Record<string, any>): string {
    // Assign models and props.
    let context = Object.assign({}, this.model.context)
    if (props) {
      Object.entries(props).forEach(([k, v]) => {
        context[`$${k}`] = v
      })
    }
    console.log(props, context)
    // Compile context.
    const contextCompiled = compile(this.source)(context)
    // Replace child components.
    const $ = cheerio.load(contextCompiled)
    Object.entries(this.components).forEach(([k, v]) => {
      const node = $(k)
      node.replaceWith(v.compile(node.attr()))
    })
    // Compile the final results.
    return $.html()
  }
}
