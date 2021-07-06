import { State, Detail } from './State'
import { compile } from 'handlebars'
import { isObjectEmpty } from '../lib'
import { paramCase } from 'param-case'
import { gEventBus } from '../lib'

type Method = (state: State) => void

const nameHash = {}

interface Configuration {
  name: string
  state?: Record<string, any>
  components?: Record<string, Component>
  props?: string[]
  methods?: Record<string, Method>
}

interface ReactiveElement {
  origin: Element
  current: Element
}

export class Component {
  name: string
  source: string
  state: State
  components: Record<string, Component> = {}
  methods: Record<string, Method> = {}
  wrapper: HTMLElement
  elementList: ReactiveElement[] = []
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
    // Create Element
    const tmp = document.createElement('div')
    tmp.innerHTML = this.source
    this.wrapper = tmp.firstElementChild as HTMLElement
    tmp.appendChild(this.wrapper.cloneNode(true))
    this.elementList.push({
      origin: tmp.lastElementChild,
      current: this.wrapper,
    })
    this.wrapper.querySelectorAll('*').forEach(el => {
      const tmp = document.createElement('div')
      tmp.appendChild(el.cloneNode(true))
      this.elementList.push({
        origin: tmp.children[0],
        current: el,
      })
    })
    // One-way Binding
    const hasInerpolation = new RegExp(`{{\\s*\\w+\\s*}}`, 'g')
    const hasPropInterpolation = new RegExp(`{{\\s*\\$\\w+\\s*}}`, 'g')
    this.elementList.forEach(el => {
      if (el.origin.children.length === 0) {
        if (hasInerpolation.exec(el.origin.innerHTML)) {
          gEventBus.on('StateUpdate', (state: Detail) => {
            const hasState = new RegExp(`{{\\s*${state.stateName}\\s*}}`, 'g')
            if (hasState.exec(el.origin.innerHTML)) {
              console.log(el.origin.innerHTML, state.stateName)
              const newCompiled = compile(el.origin.innerHTML)(this.state)
              el.current.innerHTML = newCompiled
            }
            hasState.lastIndex = 0
          })
        }
        if (hasPropInterpolation.exec(el.origin.innerHTML)) {
          gEventBus.on(
            `PropsUpdate-${this.name}`,
            (props: Record<string, any>) => {
              const newCompiled = compile(el.origin.innerHTML)(props)
              el.current.innerHTML = newCompiled
            },
          )
        }
      }
      Object.values(el.origin.attributes).forEach(attr => {
        if (hasInerpolation.exec(attr.value)) {
          gEventBus.on('StateUpdate', (state: Detail) => {
            const hasState = new RegExp(`{{\\s*${state.stateName}\\s*}}`, 'g')
            if (hasState.exec(attr.value)) {
              const context = {}
              context[state.stateName] = state.stateValue
              const newCompiled = compile(attr.value)(context)
              el.current.setAttribute(attr.name, newCompiled)
              const props = {}
              Object.values(el.current.attributes).forEach(attr => {
                props['$' + attr.name] = attr.value
              })
              gEventBus.emit(
                `PropsUpdate-${
                  this.components[el.origin.tagName.toLocaleLowerCase()].name
                }`,
                props,
              )
              el.current.replaceWith(
                this.components[el.origin.tagName.toLocaleLowerCase()].wrapper,
              )
            }
            hasState.lastIndex = 0
          })
        }
      })
      hasInerpolation.lastIndex = 0
      hasPropInterpolation.lastIndex = 0
    })
    // initialize interpolation
    Object.entries(this.state).forEach(([k, v]) => {
      gEventBus.emit('StateUpdate', {
        stateName: k,
        stateValue: v,
      } as Detail)
    })
    // Two-way Binding
    Object.entries(this.state).forEach(([k, v]) => {
      const elements = this.wrapper.querySelectorAll(`input[t-model=${k}]`)
      elements.forEach(el => {
        el.addEventListener('input', () => {
          const input = el as HTMLInputElement
          this.state[k] = input.value
        })
        const input = el as HTMLInputElement
        input.value = v
        el.removeAttribute('t-model')
      })
    })
    // Method Binding
    Object.entries(this.methods).forEach(([k, v]) => {
      const elements = this.wrapper.querySelectorAll(`[t-click=${k}]`)
      elements.forEach(el => {
        el.addEventListener('click', () => {
          v(this.state)
        })
        el.removeAttribute('t-click')
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
