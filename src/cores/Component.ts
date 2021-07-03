import { Model } from './Model'
import { Prop } from './Props'
import { compile, registerHelper } from 'handlebars'
import { isObjectEmpty } from '../lib'

export type CompileFunc = (props?: Array<any>) => string

registerHelper('component', (component: Component, ...args) => {
  let props = []
  if (!isObjectEmpty(component.configuration.props)) {
    for (let i = 0; i < args.length - 1; i++) {
      props.push(new Prop(component.configuration.props[i], args[i]))
    }
  }
  return component.compile(props)
})

interface Configuration {
  name: string
  model?: Model
  components?: Record<string, Component>
  props?: string[]
}

export class Component {
  configuration: Configuration
  compile: CompileFunc
  constructor(source: string, configuration: Configuration) {
    if (!configuration.name) {
      throw new Error('A component must have a name')
    }
    this.configuration = configuration

    this.compile = (props?: Array<any>) => {
      let context = Object.assign({}, configuration.model?.context)
      context = Object.assign(context, configuration.components)

      props?.forEach(v => (context[`$${v.name}`] = v.value))

      return compile(source)(context)
    }
  }
}
