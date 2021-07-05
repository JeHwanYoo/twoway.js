import { Model } from './Model'
import { Prop } from './Props'
import { compile, registerHelper } from 'handlebars'
import { isObjectEmpty, isArrayEmpty } from '../lib'

export type CompileFunc = (props?: Array<any>) => string

registerHelper('component', (component: Component, ...args) => {
  let props = []
  if (!isArrayEmpty(component.props)) {
    for (let i = 0; i < args.length - 1; i++) {
      props.push(new Prop(component.props[i], args[i]))
    }
  }
  return component.compile(props)
})

interface Configuration {
  name: string
  model?: Record<string, Component>
  components?: Record<string, Component>
  props?: string[]
}

export class Component {
  name: string = ''
  model: Model = new Model({})
  components: Record<string, Component> = {}
  props: string[] = []
  compile: CompileFunc
  constructor(source: string, configuration: Configuration) {
    if (!configuration.name) {
      throw new Error('A component must have a name')
    }
    this.name = configuration.name
    if (!isObjectEmpty(configuration.model)) {
      for (const [k, v] of Object.entries(configuration.model)) {
        this.model.context[k] = v
      }
    }
    if (!isObjectEmpty(configuration.components)) {
      for (const [k, v] of Object.entries(configuration.components)) {
        this.components[k] = v
      }
    }
    configuration.props?.forEach(v => this.props.push(v))
    this.compile = (props?: Array<any>) => {
      let context = Object.assign({}, this.model.context)
      context = Object.assign(context, this.components)
      props?.forEach(v => (context[`$${v.name}`] = v.value))
      return compile(source)(context)
    }
  }
}
