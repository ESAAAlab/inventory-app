<template lang='pug'>
  div
    div(class='columns is-gapless')
      div(class='column')
        nav(class='panel')
          div(class="panel-heading is-unselectable")
            h1(class='title is-4')
              span(class='has-text-light') Etudiant
          v-autocomplete(
            class='container'
            ref='userSearchField'
            v-if='!selectedUser'
            :items='users'
            v-model='selectedUser'
            :get-label='getUserLabel'
            :min-len='0'
            @update-items='getSearchUsers'
            :component-item='userTemplate'
            @item-selected='getUserTransactions'
            :placeholder='"Tapez un nom ou scannez un code barre"'
            )
          div(class='card' v-if='selectedUser')
            div(class='card-image')
              figure(class='image is-square')
                img(class='center-cropped' :src='selectedUser.pictures[0].content' alt='Image')
            div(class='card-content')
              div(class='content')
                div(class='media-content')
                  p(class='title is-4') {{ selectedUser.lastName }} {{ selectedUser.firstName }}
                  p(class='subtitle is-6' v-if='selectedUser.userType.id === 1') {{ selectedUser.studentYear.description }}
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
          div(class="panel-heading has-icons-right is-unselectable")
            h1(class='title is-4')
              span(class='has-text-light') Outils
          v-autocomplete(
            :items='tools'
            ref='toolSearchField'
            v-model='selectedTool'
            :get-label='getToolLabel'
            :min-len='0'
            @update-items='getSearchTools'
            :component-item='toolTemplate'
            @item-selected='addPendingToolLending'
            :placeholder='"Tapez un nom ou scannez un code barre"')
          div(class='panel-block is-paddingless has-text-centered' v-if='pendingLendings.length > 0')
            div(class='wide-separator')
          div(class='panel-block' v-if='pendingLendings.length > 0')
            div(class='container has-alternating-rows')
              div(class='columns is-alternating-row' v-for='tool in pendingLendings')
                div(class='column')
                  strong {{ tool.name }}
                div(class='column is-narrow')
                  number-input-spinner(v-model='tool.lendingQuantity' :max='Number(tool.stockAvailable)')
                div(class='column is-narrow')
                  button(class='button is-small is-danger is-pulled-right' v-on:click='removePendingToolLending(tool)')
                    span(class='icon is-small')
                      i(class='fa fa-times')
                    span Supprimer
          div(class='panel-block' v-if='pendingLendings.length > 0')
            button(class='button is-danger is-fullwidth' v-on:click='clearPendingToolLendings()')
              span(class='icon')
                i(class='fa fa-times')
              span Annuler le prêt
            span &nbsp;
            button(class='button is-success is-fullwidth' v-on:click='lendModalActive = true')
              span(class='icon')
                i(class='fa fa-check')
              span Prêter ces outils
        nav(class='panel' v-if='userTransactions.length > 0 || pendingReturns.length > 0')
          div(class="panel-heading has-icons-right is-unselectable")
            h1(class='title is-4')
              span(class='has-text-light') Prêts en cours
          div(class='panel-block' v-if='userTransactions.length > 0')
            div(class='container has-alternating-rows')
              div(class='columns is-alternating-row' v-for='transaction in userTransactions')
                div(class='column')
                  strong {{ transaction.transactions[0].name }} &nbsp;
                  small x {{transaction.quantity}}
                div(class='column is-marginless')
                  small {{ transaction.createdAt | formatLendingDate }}
                div(class='column is-narrow')
                  button(class='button is-small is-success is-pulled-right' v-on:click='addPendingToolReturn(transaction)')
                    span(class='icon is-small')
                      i(class='fa fa-check')
                    span Rendre outil
        nav(class='panel' v-if='pendingReturns.length > 0')
          div(class="panel-heading has-icons-right is-unselectable")
            h1(class='title is-4')
              span(class='has-text-light') Retours
          div(class='panel-block' v-if='pendingReturns.length > 0')
            div(class='container has-alternating-rows')
              div(class='columns is-alternating-row' v-for='transaction in pendingReturns')
                div(class='column')
                  strong {{ transaction.transactions[0].name }} &nbsp;
                  small x {{transaction.quantity}}
                div(class='column is-marginless')
                  small {{ transaction.createdAt | formatLendingDate }}
                div(class='column is-narrow')
                  button(class='button is-small is-danger is-pulled-right' v-on:click='removePendingToolReturn(transaction)')
                    span(class='icon is-small')
                      i(class='fa fa-times')
                    span Supprimer
          div(class='panel-block' v-if='pendingReturns.length > 0')
            button(class='button is-danger is-fullwidth' v-on:click='clearPendingToolReturns()')
              span(class='icon')
                i(class='fa fa-times')
              span Annuler le retour
            span &nbsp;
            button(class='button is-success is-fullwidth' v-on:click='returnModalActive = true')
              span(class='icon')
                i(class='fa fa-check')
              span Rendre ces outils
        nav(class='panel')
          div(class="panel-block is-unselectable")
            button(class='button is-danger is-fullwidth' v-on:click='resetUser()')
              span(class='icon')
                i(class='fa fa-times')
              span Choisir un autre utilisateur
    div(v-if='!selectedUser && latestLendings.length > 0')
      nav(class='panel')
        div(class='panel-heading is-unselectable')
          h1(class='title is-4')
            span(class='has-text-light') 10 dernières transactions
        div(class='panel-block')
          div(class='container has-alternating-rows')
              div(class='columns is-alternating-row' v-bind:class='{ "is-clickable": !transaction.ended }' v-for='transaction in latestLendings' v-on:click='!transaction.ended ? getUser(transaction.lendings[0]) : null')
                div(class='column is-narrow')
                  button(class='button is-small is-danger is-transaction-flag')
                    span(class='icon')
                      i(class='ion ion-md-log-out')
                div(class='column')
                  strong {{ transaction.lendings[0].lastName }}&nbsp;
                  | {{transaction.lendings[0].firstName}}
                div(class='column')
                  strong {{ transaction.transactions[0].name }}&nbsp;
                  small x {{transaction.quantity}}
                div(class='column is-narrow')
                  small {{ transaction.startDate | formatLendingDate }}
    div(class="modal" v-bind:class='{ "is-active": lendModalActive}')
      div(class="modal-background")
      div(class="modal-content")
        div(class='box')
          div(class='content')
            h5(class='title is-5') Etes vous sur de vouloir prêter ces articles ?
            ul
              li(v-for='tool in pendingLendings')
                strong {{ tool.name }} &nbsp;
                small x {{ tool.lendingQuantity }}
          div(class='columns')
            button(class='button column is-danger is-fullwidth' v-on:click='clearPendingToolLendings()')
              span(class='icon')
                i(class='fa fa-times')
              span Annuler le prêt
            span &nbsp;
            button(class='button column is-success is-fullwidth' v-on:click='commitLendings()')
              span(class='icon')
                i(class='fa fa-check')
              span Prêter ces outils
    div(class="modal" v-bind:class='{ "is-active": returnModalActive}')
      div(class="modal-background")
      div(class="modal-content")
        div(class='box')
          div(class='content')
            h5(class='title is-5') Etes vous sur de vouloir rendre ces articles ?
            ul
              li(v-for='transaction in pendingReturns')
                strong {{ transaction.transactions[0].name }} &nbsp;
                small x {{transaction.quantity}}
          div(class='columns')
            button(class='button column is-danger is-fullwidth' v-on:click='clearPendingToolReturns()')
              span(class='icon')
                i(class='fa fa-times')
              span Annuler le retour
            span &nbsp;
            button(class='button column is-success is-fullwidth' v-on:click='commitReturns()')
              span(class='icon')
                i(class='fa fa-check')
              span Rendre ces outils
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
        selectedUser: null,
        userTemplate: UserTemplate,

        tools: [],
        selectedTool: null,
        toolTemplate: ToolTemplate,

        pendingLendings: [],
        pendingReturns: [],

        lendModalActive: false,
        returnModalActive: false,

        userTransactions: [],
        latestLendings: []
      }
    },
    props: ['user'],
    mounted: function () {
      this.ax = this.$parent.ax
      this.$parent.setMenuActive(2)
      if (this.$props.user.id === undefined) {
        this.getLatestTransactions()
        this.$refs.userSearchField.$refs.inputField.focus()
      } else {
        this.getUser(this.$props.user)
      }
    },
    methods: {
      getLatestTransactions () {
        var vm = this
        this.ax.get('/transaction/latest/false/' + 10)
          .then(function (response) {
            vm.latestLendings = response.data
            vm.$refs.userSearchField.$refs.inputField.focus()
          })
      },

      getSearchUsers (query) {
        var vm = this
        if (query.startsWith('“')) {
          query = query.replace('“', '')
        }
        if (query.length === 0) {
          vm.users = []
          return
        }
        this.ax.get('/user/name/' + query)
          .then(function (response) {
            vm.users = response.data
          })
      },

      getUserLabel (item) {
        return item.lastName + ' ' + item.firstName
      },

      getUser (user) {
        var vm = this
        this.ax.get('/user/' + user.id)
          .then(function (response) {
            vm.selectedUser = response.data
            vm.getUserTransactions(vm.selectedUser)
          })
      },

      resetUser () {
        this.selectedUser = null
        this.users = []
        this.selectedTool = null
        this.pendingLendings = []
        this.getLatestTransactions()
      },

      getUserTransactions (user) {
        var vm = this
        this.ax.get('/transaction/user/' + user.id)
          .then(function (response) {
            vm.userTransactions = response.data
            vm.$refs.toolSearchField.$refs.inputField.focus()
          })
      },

      getSearchTools (query) {
        var vm = this
        if (query === '') {
          vm.tools = []
          return
        }
        this.ax.get('/inventory/search/available/' + query)
          .then(function (response) {
            vm.tools = response.data
          })
      },

      getToolLabel (item) {
        return item.name
      },

      addPendingToolLending (tool) {
        this.selectedTool = null
        this.tools = []
        for (var t of this.pendingLendings) {
          if (t.id === tool.id) {
            return
          }
        }
        tool.lendingQuantity = 1
        tool.tempTimestamp = Date.now()
        this.pendingLendings.push(tool)
        this.$refs.toolSearchField.$refs.inputField.focus()
      },

      removePendingToolLending (tool) {
        this.pendingLendings = this.pendingLendings.filter(function (el) {
          return el.tempTimestamp !== tool.tempTimestamp
        })
      },

      clearPendingToolLendings () {
        this.pendingLendings = []
        this.lendModalActive = false
        this.$refs.toolSearchField.$refs.inputField.focus()
      },

      commitLendings () {
        for (var t in this.pendingLendings) {
          this.lendTool(this.pendingLendings[t], t, this.pendingLendings.length)
        }
        this.selectedTool = null
        this.clearPendingToolLendings()
        this.getUserTransactions(this.selectedUser)
      },

      lendTool (tool, index, total) {
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
            vm.$parent.getOpenTransactionsCount()
          }
        })
      },

      addPendingToolReturn (transaction) {
        this.selectedTool = null
        this.tools = []
        for (var t of this.pendingReturns) {
          if (t.id === transaction.id) {
            return
          }
        }
        transaction.tempTimestamp = Date.now()
        this.pendingReturns.push(transaction)
        this.userTransactions = this.userTransactions.filter(function (el) {
          return el.id !== transaction.id
        })
        this.$refs.toolSearchField.$refs.inputField.focus()
      },

      removePendingToolReturn (transaction) {
        this.userTransactions.push(transaction)
        this.pendingReturns = this.pendingReturns.filter(function (el) {
          return el.tempTimestamp !== transaction.tempTimestamp
        })
      },

      clearPendingToolReturns () {
        for (var t of this.pendingReturns) {
          this.userTransactions.push(t)
        }
        this.pendingReturns = []
        this.returnModalActive = false
        this.$refs.toolSearchField.$refs.inputField.focus()
      },

      commitReturns () {
        for (var t in this.pendingReturns) {
          this.returnTool(this.pendingReturns[t], t, this.pendingReturns.length)
        }
        this.selectedTool = null
        this.clearPendingToolReturns()
        this.getUserTransactions(this.selectedUser)
      },

      returnTool (transaction, index, total) {
        var vm = this
        vm.selectedTransaction = transaction
        this.ax.put('/transaction/' + transaction.id)
          .then(function (response) {
            if (Number(index) + 1 === Number(total)) {
              vm.getUserTransactions(vm.selectedUser)
              vm.$parent.showAjaxSuccess({message: total + ' outils rendus'})
              vm.$parent.getOpenTransactionsCount()
            }
          })
      }
    }
  }
</script>
