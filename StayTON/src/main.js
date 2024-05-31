import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import dayjs from "dayjs";
import './registerServiceWorker'

Vue.config.productionTip = false
const relativeTime = require('dayjs/plugin/relativeTime');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration)
dayjs.extend(relativeTime)
require('dayjs/locale/zh')
dayjs.locale('zh')
const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(advancedFormat)
Vue.filter('priceDisplay', function (price) {
    return parseFloat(price).toFixed(2)
        .replace('.', ',') + ' €'
})

Vue.filter('timeStampDisplay', function (timeStamp) {
    return timeStamp.split(' ')[1]
})

new Vue({
    vuetify, router, render: h => h(App)
}).$mount('#app')
