import { Component } from './Component'
import { Detail } from './State'
import { gEventBus } from '../lib'

export class Renderer {
  rootComponent: Component
  constructor(rootComponent: Component) {
    this.rootComponent = rootComponent
    document.addEventListener('DOMContentLoaded', () => this.start())
  }
  start() {
    document.body.appendChild(this.rootComponent.wrapper)
  }
}
