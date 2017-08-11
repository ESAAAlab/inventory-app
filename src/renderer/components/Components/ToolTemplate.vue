<template>
  <div class="columns is-alternating-row is-clickable" @click="onClickItem(item)">
    <div class="column">
      <strong>{{item.name}}</strong>
    </div>
    <div class="column is-narrow">
      <small>{{item.stockAvailable}} / {{item.stockMax}}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToolTemplate',
  props: {
    item: {
      required: true
    }
  },
  methods: {
    onClickItem (item) {
      this.$parent.onClickItem(item)
    }
  }
}
</script>
