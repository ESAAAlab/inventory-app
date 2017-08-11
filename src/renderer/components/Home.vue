<template>
  <div class="columns">
    <div class="column">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3>En un clin d'oeil</h3>
        </div>
      </div>
      <div class="panel-box columns">
        <div class="column">
          echo
        </div>
        <div class="column">
          echo
        </div>
        <div class="column">
          echo
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lending-page',
  mounted: function () {
    this.$parent.setMenuActive(1)
  }
}
</script>
