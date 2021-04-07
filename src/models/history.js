import Item from "./item";

export default class History {
  constructor(items, timestamp = null) {
    this._items = items;

    this._timestamp = Date.now();
    if (timestamp) {
      this._timestamp = timestamp;
    }
  }

  static fromData(data) {
    return new History(data.items.map(Item.fromData), data.timestamp);
  }

  toData() {
    return {
      items: this._items.map(i => i.toData()),
      timestamp: this._timestamp
    };
  }

  get time() {
    return new Date(this._timestamp).toLocaleString("ja");
  }

  get items() {
    return this._items;
  }
}
