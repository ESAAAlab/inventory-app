<template lang='pug'>
  div
    div(class='panel panel-default')
      div(class='panel-heading is-unselectable')
        h1(class='title is-4')
          span(class='has-text-light') En un clin d'oeil
    div(class='panel-box columns')
      div(class='column')
        h2(class='subtitle is-5 has-text-centered') Etat du stock
        pie-chart(ref='stockChart' :donut='true' :data='stockData' :colors='stockColors' legend='bottom')
      div(class='column is-two-thirds')
        h2(class='subtitle is-5 has-text-centered') 10 plus vieux prêts
        div(class='panel-block')
          div(class='container has-alternating-rows')
            router-link(
              v-for='transaction in oldestLendings'
              :key='transaction.id'
              :to='{ name: "lend", params: { user: transaction.lendings[0] }}'
              )
              div(class='columns is-alternating-row is-clickable')
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
                  small(v-bind:class='{ "has-text-danger": isOldLending(transaction.startDate) }') {{ transaction.startDate | formatSinceData }}
</template>

<script>
import moment from 'moment'

export default {
  name: 'home-page',
  ax: null,
  data () {
    return {
      stockData: [['En stock', 1], ['Prêtés', 0]],
      stockColors: ['#0a821e', '#bd0101'],
      oldestLendings: []
    }
  },
  mounted: function () {
    this.ax = this.$parent.ax
    this.$parent.setMenuActive(1)
    this.getStockInfos()
    this.getOldestTransactions()
    this.$parent.getOpenTransactionsCount()
  },
  methods: {
    getStockInfos () {
      var vm = this
      vm.ax.get('/allStockAvailable/')
        .then(function (response) {
          vm.stockData[0] = ['En stock', response.data]
          vm.ax.get('/allStockMax/')
            .then(function (response) {
              vm.stockData[1] = ['Prêtés', response.data - vm.stockData[0][1]]
              vm.$refs.stockChart.chart.redraw()
            })
        })
    },
    getOldestTransactions () {
      var vm = this
      this.ax.get('/transaction/oldest/false/' + 10)
        .then(function (response) {
          vm.oldestLendings = response.data
        })
    },
    isOldLending (value) {
      var today = moment()
      var lendDate = moment(String(value))
      var diff = today.diff(lendDate, 'days') + 1
      if (diff >= 2) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
