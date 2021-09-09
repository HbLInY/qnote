import Memo from "./memo";
import LocalStorageManager from "../util/local-storage-manager";
import { LocalStorageKeys } from "../util/const";

export default class MemoList {
  constructor(memos = []) {
    this._memos = memos;
  }

  append(memo) {
    this._memos.push(memo);

    this._save();
  }

  remove(memo) {
    this._memos = this._memos.filter(m => m.id !== memo.id);

    this._save();
  }

  has(memo) {
    return this._memos.some(m => m.id === memo.id);
  }

  find(memo) {
    return this._memos.find(m => m.id === memo.id);
  }

  createOrUpdate(memo) {
    if (this.has(memo)) {
      const target = this.find(memo);
      target.update(memo);
    } else {
      this.append(memo);
    }

    this._save();
  }

  _save() {
    LocalStorageManager.setItem(
      LocalStorageKeys.MemoList,
      JSON.stringify(this.toData())
    );
  }

  save() {
    this._save();
  }

  toData() {
    return this._memos.map(memo => memo.toData());
  }

  static restore() {
    const memoListDataString = LocalStorageManager.getItem(
      LocalStorageKeys.MemoList
    );
    if (memoListDataString) {
      const memoListData = JSON.parse(memoListDataString);
      return new MemoList(memoListData.map(memo => Memo.fromData(memo)));
    }
    return new MemoList();
  }

  get memos() {
    return this._memos;
  }
}
