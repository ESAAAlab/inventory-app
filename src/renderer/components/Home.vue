<template lang='pug'>
  div(class='columns')
    div(class='column')
      div(class='panel panel-default')
        div(class='panel-heading')
          h3 En un clin d'oeil
      div(class='panel-box columns')
        div(class='column')
          pie-chart(ref='stockChart' :donut='true' :data='stockData' :colors='stockColors' legend='bottom')
        div(class='column')
          echo
        div(class='column')
          echo
</template>

<script>

export default {
  name: 'home-page',
  ax: null,
  data () {
    return {
      stockData: [['En stock', 4], ['Prêtés', 2]],
      stockColors: ['#1bcd88', '#fe4253']
    }
  },
  mounted: function () {
    this.ax = this.$parent.ax
    this.$parent.setMenuActive(1)
    this.getStockInfos()
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
    }
  }
}
</script>
