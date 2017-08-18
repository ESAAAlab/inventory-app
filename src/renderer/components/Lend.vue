<template lang='pug'>
  div
    div(class='columns is-gapless')
      div(class='column')
        nav(class='panel')
          p(class="panel-heading has-icons-right is-unselectable")
            span Etudiant
            a(class="button is-small is-pulled-right is-danger" v-if="selectedUser" v-on:click="resetUser")
              i(class='fa fa-repeat is-small')
          v-autocomplete(
            class='container'
            v-if='!selectedUser'
            :items='users'
            v-model='selectedUser'
            :get-label='getUserLabel'
            :min-len='0'
            @update-items='getUsers'
            :component-item='userTemplate'
            @item-selected='getUserTransactions'
            :placeholder='"Tapez un nom ou scannez un code barre"')
          div(class='card' v-if='selectedUser')
            div(class='card-image')
              figure(class='image is-square')
                img(class='center-cropped' :src='selectedUser.pictures[0].content' alt='Image')
            div(class='card-content')
              div(class='content')
                div(class='media-content')
                  p(class='title is-4') {{ selectedUser.lastName }} {{ selectedUser.firstName }}
                  p(class='subtitle is-6') {{ selectedUser.studentYear.description }}
                  p
                    small
                      a(class='panel-block' :href='"mailto:"+selectedUser.email')
                        span(class="panel-icon")
                          i(class="fa fa-envelope")
                        | {{ selectedUser.email }}
                      a(class='panel-block' :href='"mailto:"+selectedUser.email')
                        span(class="panel-icon")
                          i(class="fa fa-phone")
                        | {{ selectedUser.cellPhone }}
      div(class='column is-two-thirds' v-if='selectedUser')
        nav(class='panel')
          p(class='panel-heading is-unselectable') Outils
          v-autocomplete(
            :items='tools'
            v-model='selectedTool'
            :get-label='getToolLabel'
            :min-len='0'
            @update-items='getTools'
            :component-item='toolTemplate'
            @item-selected='addPendingTool'
            :placeholder='"Tapez un nom ou scannez un code barre"')
          div(class='panel-block is-paddingless has-text-centered' v-if='pendingTools.length > 0')
            div(class='wide-separator')
          div(class='panel-block' v-if='pendingTools.length > 0')
            div(class='container has-alternating-rows')
              div(class='columns is-alternating-row' v-for='tool in pendingTools')
                div(class='column')
                  strong {{ tool.name }}
                div(class='column is-narrow')
                  number-input-spinner(v-model='tool.lendingQuantity' :max='Number(tool.stockAvailable)')
                div(class='column is-narrow')
                  button(class='button is-small is-danger is-pulled-right' v-on:click='removePendingTool(tool)')
                    span(class='icon is-small')
                      i(class='fa fa-times')
          div(class='panel-block' v-if='pendingTools.length > 0')
            button(class='button is-danger is-fullwidth' v-on:click='clearPendingTools()')
              span(class='icon is-small')
                i(class='fa fa-times')
            span &nbsp;
            button(class='button is-success is-fullwidth' v-on:click='commitTransactions()')
              span(class='icon is-small')
                i(class='fa fa-check')
        nav(class='panel')
          p(class='panel-heading is-unselectable') Prêts en cours
          div(class='panel-block')
            div(class='container has-alternating-rows')
              div(class='columns is-alternating-row' v-for='transaction in userTransactions')
                div(class='column')
                  strong {{ transaction.transactions[0].name }} &nbsp;
                  | small x {{transaction.quantity}}
                div(class='column')
                  small {{ transaction.createdAt | formatLendingDate }}
                div(class='column is-narrow')
                  a(class='button is-small is-success is-pulled-right' v-on:click='endTransaction(transaction.id)')
                    span(class='icon is-small')
                      i(class='fa fa-check')
    div(v-if='!selectedUser')
      nav(class='panel')
        p(class='panel-heading has-icons-right is-unselectable') 10 dernieres transactions
        div(class='panel-block')
          div(class='container has-alternating-rows')
              div(class='columns is-alternating-row' v-bind:class='{ "is-clickable": !transaction.ended }' v-for='transaction in latestLendings' v-on:click='!transaction.ended ? getUser(transaction.lendings[0]) : null')
                div(class='column is-narrow')
                  a(v-if='transaction.ended' class='button is-small is-success is-outlined is-transaction-flag' disabled)
                    span(class='icon is-small')
                      i(class='fa fa-sign-in')
                  a(v-if='!transaction.ended' class='button is-small is-danger is-outlined is-transaction-flag' disabled)
                    span(class='icon is-small')
                      i(class='fa fa-sign-out')
                div(class='column')
                  strong {{ transaction.lendings[0].lastName }}&nbsp;
                  | {{transaction.lendings[0].firstName}}
                div(class='column')
                  strong {{ transaction.transactions[0].name }}&nbsp;
                  small x {{transaction.quantity}}
                div(class='column is-narrow')
                  small {{ transaction.createdAt | formatLendingDate }}
</template>

<script>
  import NumberInputSpinner from './Components/NumberInputSpinner.vue'
  import Autocomplete from './Components/v-autocomplete/Autocomplete.vue'
  import UserTemplate from './Components/UserTemplate.vue'
  import ToolTemplate from './Components/ToolTemplate.vue'

  export default {
    name: 'lending-page',
    components: {'number-input-spinner': NumberInputSpinner, 'v-autocomplete': Autocomplete},
    ax: null,
    data () {
      return {
        users: [],
        userSearchIsLoading: false,
        selectedUser: null,
        userTemplate: UserTemplate,

        tools: [],
        toolSearchIsLoading: false,
        selectedTool: null,
        toolTemplate: ToolTemplate,

        pendingTools: [],
        userTransactions: [],

        transaction: null,

        latestLendings: []
      }
    },
    mounted: function () {
      this.ax = this.$parent.ax
      this.$parent.setMenuActive(2)
      this.getLatestTransactions()
    },
    methods: {
      getUser (user) {
        var vm = this
        this.ax.get('/user/' + user.id)
          .then(function (response) {
            vm.selectedUser = response.data
            vm.userSearchIsLoading = false
            vm.getUserTransactions(vm.selectedUser)
          })
      },

      resetUser () {
        this.selectedUser = null
        this.users = []
        this.selectedTool = null
        this.pendingTools = []
        this.getLatestTransactions()
      },

      getLatestTransactions () {
        var vm = this
        this.ax.get('/transaction/latest/false/' + 10)
          .then(function (response) {
            vm.latestLendings = response.data
          })
      },

      getUsers (query) {
        var vm = this
        vm.userSearchIsLoading = true
        var queryString = '/user/name/'
        if (query.startsWith('#')) {
          queryString = '/user/barcode/'
          query = query.replace('#', '')
        }
        if (query.length === 0) {
          vm.users = []
          vm.userSearchIsLoading = false
          return
        }
        this.ax.get(queryString + query)
          .then(function (response) {
            vm.users = response.data
            vm.userSearchIsLoading = false
          })
      },

      getUserLabel (item) {
        return item.lastName + ' ' + item.firstName
      },

      getUserTransactions (user) {
        var vm = this
        this.ax.get('/transaction/user/' + user.id)
          .then(function (response) {
            vm.userTransactions = response.data
          })
      },

      getTools (query) {
        var vm = this
        vm.toolSearchIsLoading = true
        if (query === '') {
          vm.tools = []
          vm.toolSearchIsLoading = false
          return
        }
        this.ax.get('/inventory/search/available/' + query)
          .then(function (response) {
            vm.tools = response.data
            vm.toolSearchIsLoading = false
          })
      },

      getToolLabel (item) {
        return item.name
      },

      addPendingTool (tool) {
        this.selectedTool = null
        this.tools = []
        for (var t of this.pendingTools) {
          if (t.id === tool.id) {
            return
          }
        }
        tool.lendingQuantity = 1
        tool.tempTimestamp = Date.now()
        this.pendingTools.push(tool)
      },

      removePendingTool (tool) {
        this.pendingTools = this.pendingTools.filter(function (el) {
          return el.tempTimestamp !== tool.tempTimestamp
        })
      },

      clearPendingTools () {
        this.pendingTools = []
      },

      addTransaction (tool, index, total) {
        var vm = this
        vm.selectedTool = tool
        this.ax.post('/transaction', {
          userId: this.selectedUser.id,
          itemId: this.selectedTool.id,
          quantity: this.selectedTool.lendingQuantity
        }).then(function (response) {
          vm.transaction = response.data
          if (Number(index) + 1 === Number(total)) {
            vm.getUserTransactions(vm.selectedUser)
            vm.$parent.showAjaxSuccess({message: total + ' outils prêtés'})
          }
        })
      },

      commitTransactions () {
        for (var t in this.pendingTools) {
          this.addTransaction(this.pendingTools[t], t, this.pendingTools.length)
        }
        this.selectedTool = null
        this.clearPendingTools()
        this.getUserTransactions(this.selectedUser)
      },

      endTransaction (transactionId) {
        var vm = this
        this.ax.put('/transaction/' + transactionId)
          .then(function (response) {
            vm.getUserTransactions(vm.selectedUser)
            vm.$parent.showAjaxSuccess({message: 'Outil rendu'})
          })
      }
    }
  }
</script>
