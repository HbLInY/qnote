const ItemStates = {
  NotYet: 0,
  Already: 1
};

const NoteTypes = {
  Shopping: "1",
  Memo: "2"
};

const NoteTypeNames = {
  "1": "购物记录",
  "2": "随手记"
};

const LocalStorageKeys = {
  CurrentNoteType: "currentNoteType",
  SeparateMark: "separateMark",
  CurrentEditingMemo: "currentEditingMemo",
  MemoList: "memoList"
};

export { ItemStates, NoteTypes, LocalStorageKeys, NoteTypeNames };
