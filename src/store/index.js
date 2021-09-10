import Vue from "vue";
import Vuex from "vuex";
import Template from "../models/template";
import { LocalStorageKeys, NoteTypes } from "../util/const";
import LocalStorageManager from "../util/local-storage-manager";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: [],
    templates: [],
    currentTemplate: Template.restoreCurrent(),
    currentNoteType: null
  },
  getters: {
    items: state => state.items,
    templates: state => state.templates,
    currentTemplate: state => state.currentTemplate,
    currentNoteType(state) {
      if (!state.currentNoteType) {
        state.currentNoteType = LocalStorageManager.getItem(
          LocalStorageKeys.CurrentNoteType
        );
      }
      if (!state.currentNoteType) {
        state.currentNoteType = NoteTypes.Shopping;
        LocalStorageManager.setItem(
          LocalStorageKeys.CurrentNoteType,
          state.currentNoteType
        );
      }
      return state.currentNoteType;
    }
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
    },
    setNoteType(state, typeIndex) {
      state.currentNoteType = typeIndex;
      LocalStorageManager.setItem(
        LocalStorageKeys.CurrentNoteType,
        state.currentNoteType
      );
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
    },
    setNoteType({ commit }, typeIndex) {
      commit("setNoteType", typeIndex);
    }
  },
  modules: {}
});
