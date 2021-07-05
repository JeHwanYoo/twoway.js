import { State } from './State'
import { compile } from 'handlebars'
import { isObjectEmpty } from '../lib'
import { paramCase } from 'param-case'
import cheerio, { CheerioAPI } from 'cheerio'
import randomstring from 'randomstring'

type Method = (component: Component) => void

export const methodMap = {}

interface Configuration {
  name: string
  state?: Record<string, any>
  components?: Record<string, Component>
  props?: string[]
  methods?: Record<string, Method>
}

export class Component {
  name: string
  source: string
  state: State
  components: Record<string, Component> = {}
  methods: Record<string, Method> = {}
  $: CheerioAPI
  constructor(source: string, configuration?: Configuration) {
    // Set the name
    // while () {}
    // console.log(methodMap[(this.name = randomstring.generate(10))])
    // console.log(!!methodMap[(this.name = randomstring.generate(10))])
    this.name = 'foo'
    // Set the source
    this.source = source
    // Set the states
    this.state = new State(configuration?.state)
    // Set the child components.
    if (!isObjectEmpty(configuration?.components)) {
      for (const [k, v] of Object.entries(configuration.components)) {
        this.components[paramCase(k)] = v
      }
    }
    // Set Methods
    if (!isObjectEmpty(configuration?.methods)) {
      for (const [k, v] of Object.entries(configuration.methods)) {
        this.methods[k] = v
        if (!methodMap[this.name]) {
          methodMap[this.name] = {}
        }
        methodMap[this.name][k] = v.bind(this, this.state)
      }
    }
  }
  /**
   *
   * @param {Prop[]} props optional
   * @returns {string}
   */
  compile(props?: Record<string, any>): CheerioAPI {
    // Assign states and props.
    let context = Object.assign({}, this.state)
    if (props) {
      Object.entries(props).forEach(([k, v]) => {
        context[`$${k}`] = v
      })
    }
    // Compile context.
    const contextCompiled = compile(this.source)(context)
    // Replace child components.
    this.$ = cheerio.load(contextCompiled)
    Object.entries(this.components).forEach(([k, v]) => {
      const node = this.$(k)
      node.replaceWith(v.compile(node.attr()).html())
    })
    Object.entries(this.methods).forEach(([k, v]) => {
      const nodes = this.$(`[@click=${k}]`)
      nodes.each((i, el) => {
        this.$(el).attr('onclick', `Twoway.methodMap['${this.name}']['${k}']()`)
        this.$(el).removeAttr('@click')
      })
    })
    // return CheerioAPI
    return this.$
  }
}
