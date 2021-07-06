type Callback = (...params: any[]) => void

export class EventBus {
  record: Record<string, Callback[]> = {}
  on(eventname: string, callback: Callback) {
    if (!this.record[eventname]) this.record[eventname] = []
    this.record[eventname].push(callback)
  }
  emit(eventname: string, ...params: any[]) {
    this.record[eventname]?.forEach(cb => cb(...params))
  }
  remove(eventname: string, callback: Callback) {
    const idx = this.record[eventname].findIndex(cb => cb === callback)
    this.record[eventname]?.splice(idx, 1)
  }
}

export const gEventBus = new EventBus()
