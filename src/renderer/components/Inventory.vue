<template lang='pug'>
  div
    div(class='columns is-gapless')
      div(class='column')
        nav(class='panel')
          div(class="panel-heading is-unselectable")
            h1(class='title is-4')
              span(class='has-text-light') Outil
          v-autocomplete(
            class='container'
            ref='toolSearchField'
            v-if='!selectedTool'
            :items='tools'
            v-model='selectedTool'
            :get-label='getToolLabel'
            :min-len='0'
            @update-items='getSearchTools'
            :component-item='toolTemplate'
            @item-selected='getTool'
            :placeholder='"Tapez un nom ou scannez un code barre"'
            )
          div(class='card' v-if='selectedTool')
            //- div(class='card-image')
            //-   figure(class='image is-square')
            //-     img(class='center-cropped' :src='selectedTool.pictures[0].content' alt='Image')
            div(class='card-content')
              div(class='content')
                div(class='media-content')
                  p(class='title is-4') {{ selectedTool.name }}
                  p(class='subtitle is-6') {{ selectedTool.description }}
                  p
                    small
                      a(class='panel-block' :href='"mailto:"+selectedTool.email')
                        span(class="panel-icon")
                          i(class="fa fa-envelope")
                        | {{ selectedTool.name }}
                      a(class='panel-block' :href='"mailto:"+selectedTool.email')
                        span(class="panel-icon")
                          i(class="fa fa-phone")
                        | {{ selectedTool.serialNumber }}
      div(class='column is-two-thirds' v-if='selectedTool')
        nav(class='panel')
          div(class="panel-heading has-icons-right is-unselectable")
            h1(class='title is-4')
              span(class='has-text-light') Transactions
    div(v-if='!selectedTool && latestLendings.length > 0')
      nav(class='panel')
        div(class='panel-heading is-unselectable')
          h1(class='title is-4')
            span(class='has-text-light') 10 dernières transactions
        div(class='panel-block')
          div(class='container has-alternating-rows')
              div(class='columns is-alternating-row' v-bind:class='{ "is-clickable": !transaction.ended }' v-for='transaction in latestLendings' v-on:click='!transaction.ended ? getTool(transaction.lendings[0]) : null')
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
</template>

<script>
  import Autocomplete from './Components/v-autocomplete/Autocomplete.vue'
  import ToolTemplate from './Components/ToolTemplate.vue'

  export default {
    name: 'tool-search',
    components: {'v-autocomplete': Autocomplete},
    ax: null,
    data () {
      return {
        tools: [],
        selectedTool: null,
        toolTemplate: ToolTemplate,
        toolTransactions: [],

        latestLendings: []
      }
    },
    props: ['tool'],
    mounted: function () {
      this.$parent.setMenuActive(3)
      this.ax = this.$parent.ax
      if (this.$props.tool.id === undefined) {
        this.getLatestTransactions()
        this.$refs.toolSearchField.$refs.inputField.focus()
      } else {
        this.getTool(this.$props.tool)
      }
    },
    methods: {
      getLatestTransactions () {
        var vm = this
        this.ax.get('/transaction/latest/false/' + 10)
          .then(function (response) {
            vm.latestLendings = response.data
          })
      },

      getSearchTools (query) {
        var vm = this
        if (query.startsWith('“')) {
          query = query.replace('“', '')
        }
        if (query.length === 0) {
          vm.tools = []
          return
        }
        this.ax.get('/inventory/search/' + query)
          .then(function (response) {
            vm.tools = response.data
          })
      },

      getToolLabel (item) {
        return item.name
      },

      getTool (tool) {
        var vm = this
        this.ax.get('/inventory/' + tool.id)
          .then(function (response) {
            vm.selectedTool = response.data
            vm.getToolTransactions(vm.selectedTool)
          })
      },

      resetTool () {
        this.selectedTool = null
        this.tools = []
        this.getLatestTransactions()
      },

      getToolTransactions (tool) {
        var vm = this
        this.ax.get('/transaction/item/' + tool.id)
          .then(function (response) {
            vm.toolTransactions = response.data
            console.log(vm.toolTransactions)
          })
      }
    }
  }
</script>
