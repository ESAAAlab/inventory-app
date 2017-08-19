<template lang='pug'>
  div
    div(class='v-autocomplete panel-block')
      div(class='control v-autocomplete-input-group' :class='{"v-autocomplete-selected": value}')
        input(class='input' ref="inputField" :class='inputClass' type='text' v-model='searchText' :placeholder='placeholder' :disabled='disabled' @blur='blur' @focus='focus' @input='inputChange')
    div(class='v-autocomplete-list panel-block' v-if='showList && internalItems.length')
      div(class='container has-alternating-rows')
        div(:is='componentItem' :item='item' v-for='item in internalItems')
</template>

<script>
import Item from './Item.vue'
import utils from './utils.js'

export default {
  name: 'v-autocomplete',
  props: {
    componentItem: { default: () => Item },
    placeholder: String,
    minLen: { type: Number, default: utils.minLen },
    wait: { type: Number, default: utils.wait },
    value: null,
    getLabel: {
      type: Function,
      default: item => item
    },
    items: Array,
    autoSelectOneItem: { type: Boolean, default: true },
    inputClass: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchText: '',
      showList: false,
      internalItems: this.items || []
    }
  },
  methods: {
    inputChange () {
      this.showList = true
      this.onSelectItem(null, 'inputChange')
      utils.callUpdateItems(this.searchText, this.updateItems)
      this.$emit('change', this.searchText)
    },

    updateItems () {
      this.$emit('update-items', this.searchText)
    },

    focus () {
      this.showList = true
    },

    blur () {
      setTimeout(() => { this.showList = false }, 200)
    },

    onClickItem (item) {
      this.onSelectItem(item)
      this.$emit('item-clicked', item)
    },

    onSelectItem (item) {
      if (item) {
        this.internalItems = [item]
        this.searchText = this.getLabel(item)
        this.$emit('item-selected', item)
        this.resetAutocomplete()
      } else {
        this.setItems(this.items)
      }
      this.$emit('input', item)
    },

    resetAutocomplete () {
      this.searchText = ''
      this.setItems([])
    },

    setItems (items) {
      this.internalItems = items || []
    },

    isSelecteValue (value) {
      return this.internalItems.length === 1 && value === this.internalItems[0]
    }

  },
  created () {
    utils.minLen = this.minLen
    utils.wait = this.wait
    this.onSelectItem(this.value)
  },
  watch: {
    items (newValue) {
      this.setItems(newValue)
      let item = utils.findItem(this.items, this.searchText, this.autoSelectOneItem)
      if (item) {
        this.onSelectItem(item)
        this.showList = false
      }
    },
    value (newValue) {
      if (!this.isSelecteValue(newValue)) {
        this.onSelectItem(newValue)
      }
    }
  }
}
</script>
