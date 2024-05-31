<template>
  <v-btn elevation="0"
         @click="$emit('click')"
         height="52"
         rounded
  >
    <v-icon left>mdi-arrow-left</v-icon>
    Back

  </v-btn>
</template>

<script>
export default {
  name: "BackStepButton",
  props: {}
}
</script>

<style scoped>

</style>
