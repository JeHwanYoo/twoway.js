import { State } from './State'
import { compile } from 'handlebars'
import { isObjectEmpty } from '../lib'
import { paramCase } from 'param-case'

type Method = (state: State) => void

const nameHash = {}

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
  wrapper: HTMLElement
  constructor(source: string, configuration?: Configuration) {
    // Set the name
    while (nameHash[(this.name = makeid(10))]) {}
    nameHash[this.name] = true
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
      }
    }
  }
  /**
   *
   * @param {Prop[]} props optional
   * @returns {string}
   */
  compile(props?: Record<string, any>): void {
    // Assign states and props.
    let context = Object.assign({}, this.state)
    if (props) {
      Object.entries(props).forEach(([k, v]) => {
        context[`$${k}`] = v
      })
    }
    // Compile context.
    const contextCompiled = compile(this.source)(context)
    // Create Element
    const tmp = document.createElement('div')
    tmp.innerHTML = contextCompiled
    this.wrapper = tmp.firstElementChild as HTMLElement
    // Replace child components.
    Object.entries(this.components).forEach(([k, childComponent]) => {
      const elements = this.wrapper.querySelectorAll(k)
      elements.forEach(el => {
        const props = {}
        Object.values(el.attributes).forEach(attr => {
          props[attr.name] = attr.value
        })
        childComponent.compile(props)
        el.replaceWith(childComponent.wrapper)
      })
    })
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
