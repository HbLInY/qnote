import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

import Header from "./layouts/Header.vue";
import Footer from "./layouts/Footer.vue";
import Content from "./layouts/Content.vue";
import SNote from "./SNote.vue";
import MNote from "./MNote.vue";
import NoteTypeSwitch from "./components/NoteTypeSwitch";

Vue.component("qnote-header", Header);
Vue.component("qnote-content", Content);
Vue.component("qnote-footer", Footer);
Vue.component("s-note", SNote);
Vue.component("m-note", MNote);
Vue.component("note-type-switch", NoteTypeSwitch);

new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
