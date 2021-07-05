import { Component } from './Component'

export class Renderer {
  rootElement: HTMLElement
  children: Record<string, Component> = {}

  constructor(rootID: string) {
    this.rootElement = document.getElementById(rootID)
  }

  render(rootComponent: Component) {
    this.rootElement.innerHTML = rootComponent.compile()
  }
}
