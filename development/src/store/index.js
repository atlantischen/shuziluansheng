import Vue from "vue";
import Vuex from "vuex";
import "@/assets/css/reset.css";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: JSON.parse(localStorage.getItem("user")) || {}
  },
  mutations: {
    getUser(state, data) {
      state.user = data;
      localStorage.setItem("user", JSON.stringify(data));
    }
  },
  actions: {},
  modules: {}
});
