import { Component } from './Component'

export class Renderer {
  rootComponent: Component
  constructor(rootComponent: Component) {
    this.rootComponent = rootComponent
    document.addEventListener('DOMContentLoaded', () => this.update())
    document.addEventListener('StateUpdated', () => this.update())
  }
  get html(): string {
    return this.rootComponent.$.html()
  }
  update() {
    this.rootComponent.compile()
    document.body.innerHTML = this.rootComponent.$.html()
  }
}
