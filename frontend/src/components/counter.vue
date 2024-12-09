<script>
  export default {
    data: () => {
      return {
        count: 0,
      }
    },

    methods: {
      incrementCount: function() {
        this.count++
      }
    }
  }
</script>

<template>
  <button @click="incrementCount">Clicked: {{count}}</button>
</template>

<style>
</style>
