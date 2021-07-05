import { State } from './State'
import { compile } from 'handlebars'
import { isObjectEmpty } from '../lib'
import { paramCase } from 'param-case'
import cheerio from 'cheerio'

interface Configuration {
  name: string
  states?: Record<string, any>
  components?: Record<string, Component>
  props?: string[]
}

export class Component {
  source: string
  states: State
  components: Record<string, Component> = {}
  constructor(source: string, configuration?: Configuration) {
    // Set the source
    this.source = source
    // Set the states
    this.states = new State(configuration?.states)

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
    // Assign states and props.
    let context = Object.assign({}, this.states)
    if (props) {
      Object.entries(props).forEach(([k, v]) => {
        context[`$${k}`] = v
      })
    }
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
