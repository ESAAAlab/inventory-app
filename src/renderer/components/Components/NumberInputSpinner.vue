<template>
  <div class="field has-addons">
    <p class="control">
      <input type="button" @click="decrementValue" class="button is-small" value="-"/>
    </p>
    <p class="control">
      <input
          type="number"
          ref="input"
          v-bind:value="value"
          class="input is-small is-disabled"
          :disabled="true"
          :min="min"
          :max="max"
      />
    </p>
    <p class="control">
      <input type="button" @click="incrementValue" class="button is-small" value="+"/>
    </p>
  </div>
</template>

<script>
export default {
  name: 'number-input-spinner',

  props: {
    value: {
      type: Number,
      default: 1
    },
    min: {
      default: 1,
      type: Number
    },
    max: {
      default: 10,
      type: Number
    },
    step: {
      default: 1,
      type: Number
    }
  },

  methods: {
    updateValue: function (value) {
      var formattedValue = Number(value)
      this.$refs.input.value = formattedValue
      this.$emit('input', formattedValue)
    },
    incrementValue: function () {
      var newVal = Number(this.$refs.input.value) + 1
      if (newVal <= this.max) {
        this.updateValue(newVal)
      }
    },
    decrementValue: function () {
      var newVal = Number(this.$refs.input.value) - 1
      if (newVal >= this.min) {
        this.updateValue(newVal)
      }
    }
  }
}
</script>

<style lang="css" scoped>
  input {
    text-align: center;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
</style>
