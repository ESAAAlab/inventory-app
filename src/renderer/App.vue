<template lang='pug'>
  div(id='app')
    section(class='hero is-unselectable' id='header')
      div(class='hero-body')
        div(class='container')
          figure(class='image is-64x64')
            img(src='~@/assets/logo.svg')
    div
      nprogress-container
    div(class='tabs container is-unselectable is-centered is-medium is-fullwidth' id='menubar')
      ul
        li(v-bind:class='{ "is-active": isHome }')
          router-link(to='/') Accueil
        li(v-bind:class='{ "is-active": isLend }')
          router-link(:to='{ name: "lend", params: { user: 0 }}' ) Prêts &amp; Retours
        li(v-bind:class='{ "is-active": isInventory }')
          router-link(:to='{ name: "inventory", params: { tool: 0 }}') Inventaire
    div(class='container')
    router-view
</template>

<script>
  import axios from 'axios'
  import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
  import NProgress from 'vue-nprogress'

  if (process.type === 'renderer') {
    var remote = require('electron').remote
    // eslint-disable-next-line
    var FramelessFrame = require('electron-frameless-frame')
    window.FramelessFrame(remote, {
      theme: 'ff-sierra'
    })
  }

  const nprogress = new NProgress({ parent: '.nprogress-container' })

  export default {
    name: 'inventory-app',
    ax: null,
    components: {NprogressContainer, nprogress},
    data () {
      return {
        isHome: true,
        isLend: false,
        isInventory: false,
        ajaxLoading: false,
        ajaxProgress: 0,
        ajaxError: false
      }
    },
    created: function () {
      var vm = this

      // eslint-disable-next-line
      axios.defaults.baseURL = INVENTORY_BASE_URL
      this.ax = axios.create({})

      this.ax.interceptors.request.use(function (config) {
        // send success
        nprogress.start()
        return config
      }, function (error) {
        // send error
        nprogress.done()
        // catch(error)
        return Promise.reject(error)
      })
      // Add a response interceptor
      this.ax.interceptors.response.use(function (response) {
        // response success
        nprogress.done()
        return response
      }, function (error) {
        // response error
        nprogress.done()
        vm.showAjaxError()
        // console.log(error)
        return Promise.reject(error)
      })
    },
    notifications: {
      showAjaxError: {
        title: 'Problème lors de la connexion',
        message: 'Merci de réessayer plus tard',
        type: 'error',
        timeout: '1500'
      },
      showAjaxSuccess: {
        title: 'Transaction réussie',
        message: 'Outils prétés',
        type: 'success',
        timeout: '1500'
      }
    },
    methods: {
      setMenuActive: function (item) {
        this.isHome = item === 1
        this.isLend = item === 2
        this.isInventory = item === 3
      },
      ajaxStatus: function (val) {
        this.ajaxLoading = val === 1
        this.ajaxError = val === 2
        console.log(this.ajaxLoading + ' / ' + this.ajaxError)
      },
      getOpenTransactionsCount () {
        var vm = this
        vm.ax.get('/openTransactions')
          .then(function (response) {
            if (process.type === 'renderer') {
              remote.app.setBadgeCount(response.data)
            }
          })
      }
    }
  }
</script>
