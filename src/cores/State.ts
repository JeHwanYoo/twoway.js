import { isUndefindOrNull } from '../lib'
import { gEventBus } from '../lib'

export interface Detail {
  stateName: string
  stateValue: any
}

export class State {
  constructor(context: Record<string, any>) {
    const _data: Record<string, any> = {}
    Object.entries(context || {}).forEach(([k, v]) => {
      _data[k] = v
    })
    return new Proxy(_data, {
      get(target, prop) {
        const data = target[prop.toString()]
        if (!isUndefindOrNull(data)) {
          return target[prop.toString()]
        } else {
          console.error(`${prop.toString()} is not a registered state.`)
          return undefined
        }
      },
      set(target, prop, value) {
        if (!isUndefindOrNull(target[prop.toString()])) {
          target[prop.toString()] = value
          gEventBus.emit('StateUpdate', {
            stateName: prop.toString(),
            stateValue: value,
          } as Detail)
          return true
        } else {
          console.error(`${prop.toString()} is not a registered state.`)
          return false
        }
      },
    })
  }
}
