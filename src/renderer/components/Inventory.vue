<template lang='pug'>
  div(class='columns')
    div(class='column')
      div(class='panel panel-default')
        div(class='panel-heading')
          h3 HEADER
        div
          input(v-model='searchUser' placeholder='search')
        div
          ul
            li(v-for='user in users') {{ user.lastName }} {{ user.firstName }}
</template>

<script>
  export default {
    name: 'user-search',
    ax: null,
    data () {
      return {
        users: [],
        searchUser: ''
      }
    },
    mounted: function () {
      this.$parent.setMenuActive(3)
      this.ax = this.$parent.ax
    }
  }
</script>
