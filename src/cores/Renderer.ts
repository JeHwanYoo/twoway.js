import { Component } from './Component'
import { Detail } from './State'

export class Renderer {
  rootComponent: Component
  constructor(rootComponent: Component) {
    this.rootComponent = rootComponent
    document.addEventListener('DOMContentLoaded', () => this.start())
    document.addEventListener('StateUpdated', evt =>
      this.update((evt as CustomEvent).detail),
    )
  }
  get html(): string {
    return this.rootComponent.$.html()
  }
  start() {
    this.rootComponent.compile()
    document.body.innerHTML = this.rootComponent.$.html()
    // Two-way Binding
    this.rootComponent.inputList.forEach(v => {
      const elements = document.querySelectorAll(
        `input[t-model=${v.modelName}]`,
      )
      elements.forEach(el => {
        el.addEventListener('input', evt => {
          const input = el as HTMLInputElement
          this.rootComponent.state[v.modelName] = input.value
        })
        const input = el as HTMLInputElement
        const initVal = input.value
        el.removeAttribute('value')
        el.removeAttribute('t-model')
        input.value = initVal
      })
    })
  }
  update(detail: Detail) {
    console.log(detail)
  }
}
