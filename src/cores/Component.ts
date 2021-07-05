import { State } from './State'
import { compile } from 'handlebars'
import { isObjectEmpty } from '../lib'
import { paramCase } from 'param-case'
import cheerio, { CheerioAPI, Element } from 'cheerio'

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
  inputList: {
    modelName: string
    modelEl: Element
  }[]
  constructor(source: string, configuration?: Configuration) {
    // Set the name
    while (methodMap[(this.name = makeid(10))]) {}
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
    // Event Mapping
    Object.entries(this.methods).forEach(([k]) => {
      const nodes = this.$(`[@click=${k}]`)
      nodes.each((i, el) => {
        this.$(el).attr('onclick', `Twoway.methodMap['${this.name}']['${k}']()`)
        this.$(el).removeAttr('@click')
      })
    })
    // Two-way Binding
    Object.entries(this.state).forEach(([k, v]) => {
      const nodes = this.$(`input[t-model=${k}]`)
      this.inputList = []
      nodes.each((i, el) => {
        this.$(el).val(v)
        this.inputList.push({
          modelName: el.attribs['t-model'],
          modelEl: el,
        })
      })
    })
    // return CheerioAPI
    return this.$
  }
}

function makeid(length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
