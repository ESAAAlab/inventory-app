import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'

import moment from 'moment'

import NProgress from 'vue-nprogress'
import VueNotifications from 'vue-notifications'
import miniToastr from 'mini-toastr'

import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'
// eslint-disable-next-line
import Chart from 'chart.js'

import './assets/styles.sass'
import 'font-awesome/css/font-awesome.css'
import 'ionicons/dist/css/ionicons.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.filter('formatLendingDate', function (value) {
  return moment(String(value)).locale('fr').format('Do MMMM YYYY à kk:mm')
})

Vue.filter('formatSinceData', function (value) {
  var today = moment()
  var lendDate = moment(String(value))
  var diff = today.diff(lendDate, 'days') + 1
  return 'Depuis ' + diff + ' jours'
})

Vue.use(NProgress)
Vue.use(VueChartkick, { Chartkick })

// SETUP NOTIFICATIONS
const toastTypes = {
  success: 'success',
  error: 'error',
  info: 'info',
  warn: 'warn'
}

miniToastr.init({types: toastTypes})
miniToastr.setIcon('error', 'i', {'class': 'fa fa-warning'})
miniToastr.setIcon('info', 'i', {'class': 'fa fa-info-circle'})
miniToastr.setIcon('success', 'i', {'class': 'fa fa-check-circle-o'})
miniToastr.setIcon('warn', 'i', {'class': 'fa fa-exclamation-triangle'})

// Here we setup messages output to `mini-toastr`
function toast ({title, message, type, timeout, cb}) {
  return miniToastr[type](message, title, timeout, cb)
}

// Binding for methods .success(), .error() and etc. You can specify and map your own methods here.
// Required to pipe our output to UI library (mini-toastr in example here)
// All not-specified events (types) would be piped to output in console.
const options = {
  success: toast,
  error: toast,
  info: toast,
  warn: toast
}

// Activate plugin
Vue.use(VueNotifications, options)// VueNotifications have auto install but if we want to specify options we've got to do it manually.

// eslint-disable no-new
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
