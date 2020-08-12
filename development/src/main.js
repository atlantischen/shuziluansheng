// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'; //element-ui
import http from '@/assets/js/http';
import { server } from '@/assets/js/http-server';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/iconfont/iconfont.css'
import '@/assets/css/reset.css'

Vue.config.productionTip = false
Vue.prototype.$http = http;
Vue.prototype.$server = server;
window.$eventBus = new Vue()

// var Less = require('Less');
Vue.use(ElementUI); // 全局注册插件
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})