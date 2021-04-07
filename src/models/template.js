import Item from "./item";

export default class Template {
  constructor(name, items) {
    this.name = name;
    this.items = items.map(i => {
      return Item.fromData(i);
    });
  }

  static fromData(data) {
    return new Template(data.name, data.items);
  }

  toData() {
    return {
      name: this.name,
      items: this.items.map(i => {
        return i.toData();
      })
    };
  }

  appendItem(item) {
    this.items.unshift(item);
  }

  updateItem(item) {
    const target = this.items.find(i => i.id === item.id);
    target.update(item);
  }

  removeItem(item) {
    this.items = this.items.filter(i => i.id !== item.id);
  }

  saveCurrent() {
    try {
      localStorage.setItem("current", JSON.stringify(this.toData()));
    } catch (e) {
      console.log("LocalStorage not available.");
    }
  }

  update(template) {
    this.items = template.items;
  }

  static restoreCurrent() {
    try {
      const currentData = localStorage.getItem("current");
      if (currentData) {
        return Template.fromData(JSON.parse(currentData));
      } else {
        return new Template("", []);
      }
    } catch (e) {
      console.log("LocalStorage not available.");
    }
  }
}
