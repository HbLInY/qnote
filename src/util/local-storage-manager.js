export default class LocalStorageManager {
  static getItem(name) {
    try {
      return localStorage.getItem(name);
    } catch (e) {
      console.error("LocalStorage unavailable.", e);
      return null;
    }
  }

  static setItem(name, value) {
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      console.error("LocalStorage unavailable.", e);
    }
  }

  static removeItem(name) {
    try {
      localStorage.removeItem(name);
    } catch (e) {
      console.error("LocalStorage unavailable.", e);
    }
  }
}
