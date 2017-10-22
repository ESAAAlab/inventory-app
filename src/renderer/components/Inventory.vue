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
          button(class='button is-success is-fullwidth' v-if='!selectedTool' v-on:click='addTool()')
            span(class='icon')
              i(class='fa fa-plus')
            span Ajouter un outil
          div(class='card' v-if='selectedTool')
            div(class='card-content')
              div(class='content')
                div(class='media-content')
                  div(class='control')
                    div(class='field')
                      label(class='label is-small') Nom
                      div(class='control')
                        input(class='input' v-bind:class='{ "is-danger": !selectedTool.name }' type='text' v-model='selectedTool.name' placeholder='Nom' )
                    div(class='field is-grouped' v-if='isNewTool')
                      label(class='label is-small') Marque
                        div(class='control is-expanded')
                          input(class='input' type='text' v-model='selectedTool.brand' placeholder='Marque')
                      span &nbsp;
                      label(class='label is-small') Mod&egrave;le
                        div(class='control')
                          input(class='input' type='text' v-model='selectedTool.model' placeholder='Modèle')
                      span &nbsp;
                      label(class='label is-small') N° de s&eacute;rie
                        div(class='control')
                          input(class='input' type='text' v-model='selectedTool.serialNumber' placeholder='N° de série')
                      span &nbsp;
                      label(class='label is-small') Code barre
                        div(class='field has-addons')
                          div(class='control is-expanded')
                            input(class='input' type='text' v-model='selectedTool.barcode' placeholder='Code barre')
                          div(class='control')
                            a(class='button is-info' v-on:click='generateBarcode()') Generer
                    div(class='field is-grouped' v-if='!isNewTool')
                      label(class='label is-small') Marque
                        div(class='control is-expanded')
                          input(class='input is-small' type='text' v-model='selectedTool.brand' placeholder='Marque')
                      span &nbsp;
                      label(class='label is-small') Mod&egrave;le
                        div(class='control')
                          input(class='input is-small' type='text' v-model='selectedTool.model' placeholder='Modèle')
                    div(class='field is-grouped' v-if='!isNewTool')
                      label(class='label is-small') N° de s&eacute;rie
                        div(class='control')
                          input(class='input is-small' type='text' v-model='selectedTool.serialNumber' placeholder='N° de série')
                      span &nbsp;
                      label(class='label is-small') Code barre
                        div(class='field has-addons')
                          div(class='control is-expanded')
                            input(class='input is-small' type='text' v-model='selectedTool.barcode' placeholder='Code barre')
                          div(class='control')
                            a(class='button is-info is-small' v-on:click='generateBarcode()') Generer
                    div(class='field')
                      label(class='label is-small') Description
                      div(class='control')
                        input(class='input' v-bind:class='{ "is-small": !isNewTool }' type='text' v-model='selectedTool.description' placeholder='Description')
                    div(class='field is-grouped')
                      label(class='label is-small') Disponible en stock
                        div(class='control is-expanded')
                          input(class='input' v-bind:class='{ "is-small": !isNewTool }' type='text' v-model='selectedTool.stockAvailable' placeholder='Marque')
                      span &nbsp;
                      label(class='label is-small') Stock maximum
                        div(class='control')
                          input(class='input' v-bind:class='{ "is-small": !isNewTool }' type='text' v-model='selectedTool.stockMax' placeholder='Modèle')
                    div(class='field columns')
                      div(class='column')
                        button(class='button is-danger is-fullwidth' v-on:click='resetTool()')
                          span(class='icon')
                            i(class='fa fa-times')
                          span Annuler
                      div(class='column')
                        button(class='button is-success is-fullwidth' v-on:click='updateTool()')
                          span(class='icon')
                            i(class='fa fa-check')
                          span Enregistrer

      div(class='column is-two-thirds' v-if='selectedTool && selectedTool.id != null')
        nav(class='panel')
          div(class="panel-heading has-icons-right is-unselectable")
            h1(class='title is-4')
              span(class='has-text-light') Transactions
          div(class='panel-block' v-if='toolTransactions.length > 0')
            div(class='container has-alternating-rows')
              router-link(
                v-for='transaction in toolTransactions'
                :key='transaction.id'
                :to='{ name: "lend", params: { user: transaction.lendings[0] }}'
                )
                div(class='columns is-alternating-row is-clickable')
                  div(class='column')
                    strong {{ transaction.lendings[0].lastName }}&nbsp;
                    | {{ transaction.lendings[0].firstName }}
                  div(class='column is-marginless')
                    small {{ transaction.startDate | formatLendingDate }}
                  div(class='column is-marginless' v-if='transaction.ended')
                    small {{ transaction.effectiveEndDate | formatLendingDate }}
                  div(class='column is-narrow')
                    button(class='button is-small is-pulled-right' v-bind:class='{ "is-success": transaction.ended, "disabled": transaction.ended, "is-danger": !transaction.ended}')
                      span(class='icon is-small')
                        i(class='fa' v-bind:class='{ "fa-check": transaction.ended, "fa-times": !transaction.ended }')
                      span(v-if='transaction.ended') Outil Rendu
                      span(v-if='!transaction.ended') Outil non rendu
        nav(class='panel')
          div(class="panel-block is-unselectable")
            button(class='button is-danger is-fullwidth' v-on:click='resetTool()')
              span(class='icon')
                i(class='fa fa-times')
              span Choisir un autre outil
    div(v-if='!selectedTool && latestLendings.length > 0')
      nav(class='panel')
        div(class='panel-heading is-unselectable')
          h1(class='title is-4')
            span(class='has-text-light') 10 dernières transactions
        div(class='panel-block')
          div(class='container has-alternating-rows')
            div(class='columns is-alternating-row is-clickable' v-for='transaction in latestLendings' v-on:click='getTool(transaction.transactions[0])')
              div(class='column is-narrow')
                button(class='button is-small is-transaction-flag' v-bind:class='{ "is-danger": !transaction.ended, "is-success": transaction.ended }')
                  span(class='icon')
                    i(class='ion' v-bind:class='{ "ion-md-log-out": !transaction.ended, "ion-md-log-in": transaction.ended }')
              div(class='column')
                strong {{ transaction.transactions[0].name }}&nbsp;
                small x {{transaction.quantity}}
              div(class='column')
                strong {{ transaction.lendings[0].lastName }}&nbsp;
                | {{transaction.lendings[0].firstName}}
              div(class='column is-narrow')
                small {{ transaction.startDate | formatLendingDate }}
</template>

<script>
  import Autocomplete from './Components/v-autocomplete/Autocomplete.vue'
  import ToolTemplate from './Components/ToolTemplate.vue'
  import randomstring from 'randomstring'

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

        latestLendings: [],

        isNewTool: false
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
        this.ax.get('/transaction/latest/' + 10)
          .then(function (response) {
            vm.latestLendings = response.data
            vm.$refs.toolSearchField.$refs.inputField.focus()
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

      generateBarcode () {
        this.selectedTool.barcode = 'ESA' + randomstring.generate({
          length: 10,
          charset: 'numeric'
        })
      },

      updateTool () {
        var vm = this
        if (this.isNewTool) {
          this.ax.post('/inventory/', this.selectedTool)
            .then(function (response) {
              vm.isNewTool = false
              vm.selectedTool = response.data
              vm.getToolTransactions(vm.selectedTool)
            })
        } else {
          this.ax.put('/inventory/' + this.selectedTool.id, this.selectedTool)
            .then(function (response) {
              vm.selectedTool = response.data
              vm.getToolTransactions(vm.selectedTool)
            })
        }
      },

      addTool () {
        this.isNewTool = true
        this.selectedTool = {
          name: null,
          model: null,
          brand: null,
          barcode: null,
          serialNumber: null,
          inventoryNumber: null,
          acquisitionPrice: null,
          acquisitionDate: null,
          description: null,
          isConsummable: false,
          stockMax: 1,
          stockAvailable: 1,
          stockUnit: 'pc',
          stockStep: 1,
          itemLocationId: null,
          itemCategoryId: null
        }
      },

      resetTool () {
        this.isNewTool = false
        this.selectedTool = null
        this.tools = []
        this.getLatestTransactions()
      },

      getToolTransactions (tool) {
        var vm = this
        this.ax.get('/transaction/item/' + tool.id)
          .then(function (response) {
            vm.toolTransactions = response.data
          })
      }
    }
  }
</script>
