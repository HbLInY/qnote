const STRING_CHOICES =
  "qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM";

export default class IDGenerator {
  constructor(length = 10) {
    this._idLength = length;
  }

  generate() {
    const ids = [];
    for (let i = 0; i < this._idLength; i += 1) {
      ids.push(
        STRING_CHOICES[Math.floor(Math.random() * STRING_CHOICES.length)]
      );
    }
    return ids.join("");
  }
}
