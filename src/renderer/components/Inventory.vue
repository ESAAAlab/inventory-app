<template>
  <div class="columns">
    <div class="column">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3>HEADER</h3>
        </div>
        <div>
          <input v-model="searchUser" placeholder="search">
        </div>
        <div>
          <ul>
            <li v-for="user in users">{{ user.lastName }} {{ user.firstName }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
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
