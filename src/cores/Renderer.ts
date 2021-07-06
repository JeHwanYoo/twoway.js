import { Component } from './Component'
import { Detail } from './State'
import { compile } from 'handlebars'
import cheerio from 'cheerio'

export class Renderer {
  rootComponent: Component
  constructor(rootComponent: Component) {
    this.rootComponent = rootComponent
    document.addEventListener('DOMContentLoaded', () => this.start())
    document.addEventListener('StateUpdated', evt =>
      this.update((evt as CustomEvent).detail),
    )
  }
  start() {
    this.rootComponent.compile()
    document.body.appendChild(this.rootComponent.wrapper)
    // Method Binding
    Object.entries(this.rootComponent.methods).forEach(([k, v]) => {
      const elements = document.querySelectorAll(`[t-click=${k}]`)
      elements.forEach(el => {
        el.addEventListener('click', () => {
          v(this.rootComponent.state)
        })
        el.removeAttribute('t-click')
      })
    })
    // Two-way Binding
    Object.entries(this.rootComponent.state).forEach(([k, v]) => {
      const elements = document.querySelectorAll(`input[t-model=${k}]`)
      elements.forEach(el => {
        el.addEventListener('input', () => {
          const input = el as HTMLInputElement
          this.rootComponent.state[k] = input.value
        })
        const input = el as HTMLInputElement
        input.value = v
        el.removeAttribute('t-model')
      })
    })
  }
  update(detail: Detail) {
    const interpolation = /{{\s*\w+\s*}}/g
    document.querySelectorAll('body *').forEach(v => {
      if (v.children.length === 0) {
        const tmp = document.createElement('div')
        tmp.appendChild(v.cloneNode(false))
        console.log(v, v.innerHTML, interpolation.exec(v.innerHTML))
        if (interpolation.exec(v.innerHTML)) {
          const compiled = compile(v.innerHTML)(this.rootComponent.state)
          console.log(compiled)
        }
      }
    })
  }
}
