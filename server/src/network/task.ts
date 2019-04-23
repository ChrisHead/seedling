import { processPhotos } from "./processPhotos"

interface ITaskOptions {
  interval: number
}

export const task = {
  running: false,
  _timeout: null,
  start({ interval }: ITaskOptions) {
    if (this.running) {
      console.warn("network task already running")
      return
    }

    this.running = true

    const step = async () => {
      if (!this.running) {
        return
      }
      await this.runOnce()
      this._timeout = setTimeout(step, interval)
    }

    step()
  },
  runOnce() {
    return processPhotos()
  },
  stop() {
    this.running = false
    clearTimeout(this._timeout)
    this._timeout = null
  },
}
