import { ItemStates } from "../util/const";

export default class Item {
  constructor(name, expect, id = null, state = ItemStates.NotYet) {
    this.name = name;
    this.expect = expect;

    this._state = state;
    this._id = id;
  }

  static fromData(data) {
    const instance = new Item(data.name, data.expect);
    instance.generateId();
    return instance;
  }

  static fromProcessingData(data) {
    return new Item(data.name, data.expect, data.id, data.state);
  }

  toData() {
    return {
      name: this.name,
      expect: this.expect
    };
  }

  toProcessingData() {
    return {
      name: this.name,
      expect: this.expect,
      id: this._id,
      state: this._state
    };
  }

  generateId() {
    this._id = 1000 * Math.random();
  }

  get id() {
    return this._id;
  }

  get state() {
    return this._state;
  }

  clone() {
    return new Item(this.name, this.expect, this._id);
  }

  update(item) {
    this.name = item.name;
    this.expect = item.expect;
  }

  purchase() {
    this._state = ItemStates.Already;
  }

  cancel() {
    this._state = ItemStates.NotYet;
  }
}
