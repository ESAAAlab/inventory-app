<template lang='pug'>
  div(class='columns is-alternating-row is-clickable' @click='onClickItem(item)')
    div(class='column is-narrow')
      p(class='media-left image is-32x32')
        img(class='small-avatar center-cropped' :src='item.pictures[0].content' alt='Image')
    div(class='column')
      strong {{item.lastName}}&nbsp;
      | {{item.firstName}}
    div(class='column is-narrow')
      small(v-if='item.userType.id === 1') {{item.studentYear.description}}
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
