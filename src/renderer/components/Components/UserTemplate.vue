<template>
  <div class="columns is-alternating-row is-clickable" @click="onClickItem(item)">
    <div class="column is-narrow">
      <p class="media-left image is-32x32">
        <img class="small-avatar center-cropped" :src="item.pictures[0].content" alt="Image">
      </p>
    </div>
    <div class="column">
      <strong>{{item.lastName}}</strong> {{item.firstName}}
    </div>
    <div class="column is-narrow">
      <small>{{item.studentYear.description}}</small>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserTemplate',
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
