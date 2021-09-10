import IDGenerator from "../util/id-generator";
import LocalStorageManager from "../util/local-storage-manager";
import { LocalStorageKeys } from "../util/const";

export default class Memo {
  constructor(
    id = null,
    name = "",
    text = "",
    separateMark = "、",
    content = []
  ) {
    this._id = null;
    if (id) {
      this._id = id;
    } else {
      this._id = new IDGenerator(10).generate();
    }
    this._name = name;
    this._text = text;
    this._separateMark = separateMark;

    this._timer = null;
    this._content = content;
    if (this._content.length <= 0) {
      this._contentRefresh();
    }

    this._autoSaveAsCurrent = false;
  }

  _contentRefresh() {
    this._content = this._text.split(this._separateMark).map(t => ({
      text: t,
      selected: false
    }));

    if (this._autoSaveAsCurrent) {
      LocalStorageManager.setItem(
        LocalStorageKeys.CurrentEditingMemo,
        JSON.stringify(this.toData())
      );
    }
  }

  enableAutoSave() {
    this._autoSaveAsCurrent = true;
  }

  disableAutoSave() {
    this._autoSaveAsCurrent = false;
  }

  update(memo) {
    if (memo.name) {
      this._name = memo.name;
    }
    if (memo.text) {
      this._text = memo.text;
      this._contentRefresh();
    }
    if (memo.separateMark) {
      this._separateMark = memo.separateMark;
    }
  }

  static fromData(data) {
    const text = data.content.map(c => c.text).join(data.separateMark);
    return new Memo(
      data.id || null,
      data.name || "",
      text,
      data.separateMark || "",
      data.content || []
    );
  }

  toData() {
    return {
      id: this._id,
      name: this._name,
      content: this._content,
      separateMark: this._separateMark
    };
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get text() {
    return this._text;
  }

  set text(value) {
    this._text = value;
    window.clearTimeout(this._timer);
    this._timer = window.setTimeout(() => {
      this._contentRefresh();
    }, 300);
  }

  get separateMark() {
    return this._separateMark;
  }

  set separateMark(value) {
    this._separateMark = value;
    window.clearTimeout(this._timer);
    this._timer = window.setTimeout(() => {
      this._contentRefresh();
    }, 300);
  }

  get content() {
    return this._content;
  }
}
