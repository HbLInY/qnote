import Vue from "vue";
import Vuex from "vuex";
import Template from "../models/template";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: [],
    templates: [],
    currentTemplate: Template.restoreCurrent()
  },
  getters: {
    items: state => state.items,
    templates: state => state.templates,
    currentTemplate: state => state.currentTemplate
  },
  mutations: {
    setTemplates(state, templates) {
      state.templates = templates.map(t => {
        return Template.fromData(t);
      });
    },
    saveCurrentTemplate(state) {
      const duplicatedTemplate = state.templates.find(
        t => t.name === state.currentTemplate.name
      );
      if (duplicatedTemplate) {
        duplicatedTemplate.update(state.currentTemplate);
      } else {
        state.templates.push(state.currentTemplate);
      }
      try {
        localStorage.setItem(
          "templates",
          JSON.stringify(state.templates.map(t => t.toData()))
        );
      } catch (e) {
        console.log("LocalStorage not available.");
      }
    },
    removeTemplate(state, template) {
      state.templates = state.templates.filter(t => t.name !== template.name);
      try {
        localStorage.setItem(
          "templates",
          JSON.stringify(state.templates.map(t => t.toData()))
        );
      } catch (e) {
        console.log("LocalStorage not available.");
      }
    }
  },
  actions: {
    loadTemplates({ commit }) {
      try {
        const templatesData = localStorage.getItem("templates");
        if (templatesData) {
          commit("setTemplates", JSON.parse(templatesData));
        }
      } catch {
        console.log("LocalStorage not available.");
      }
    },
    saveCurrentTemplate({ commit }) {
      commit("saveCurrentTemplate");
    },
    removeTemplate({ commit }, template) {
      commit("removeTemplate", template);
    }
  },
  modules: {}
});
