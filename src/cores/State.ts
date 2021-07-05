class Observable<T> {
  _value: T
  constructor(data: T) {
    this._value = data
  }
  get value() {
    return this._value
  }
  set value(newValue) {
    this._value = newValue
  }
}

export class State {
  constructor(context: Record<string, any>) {
    const _data: Record<string, any> = {}
    Object.entries(context || {}).forEach(([k, v]) => {
      _data[k] = new Observable(v)
    })
    return new Proxy(_data, {
      get(target, prop) {
        const data = target[prop.toString()]
        if (data) {
          return target[prop.toString()].value
        } else {
          console.error(`${prop.toString()} is not a registered state.`)
          return undefined
        }
      },
      set(target, prop, value) {
        if (target[prop.toString()]) {
          target[prop.toString()].value = value
          return true
        } else {
          console.error(`${prop.toString()} is not a registered state.`)
          return false
        }
      },
    })
  }
}
