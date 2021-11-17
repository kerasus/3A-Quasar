import { Collection, Model } from 'js-abstract-model'
import { createApp } from 'vue'
if (!window.app) {
// window.app
  window.app = createApp({})
}
import Time from '../plugins/time'

class CheckingTime extends Model {
  constructor (data) {
    super(data, [
      { key: 'start' },
      { key: 'end' }
    ])
  }
}

class CheckingTimeList extends Collection {
  model () {
    return CheckingTime
  }

  getLastItem () {
    const listLength = this.list.length
    if (listLength === 0) {
      return false
    }
    return this.list[(listLength - 1)]
  }

  addStart () {
    this.addItem({
      start: Time.now()
    })
  }

  addEnd () {
    const lastItem = this.getLastItem()
    if (!lastItem) {
      // ToDo
      // return
    }
    // ToDo : app.set
    // window.app.set(lastItem, 'end', Time.now())
  }
}

export { CheckingTime, CheckingTimeList }
