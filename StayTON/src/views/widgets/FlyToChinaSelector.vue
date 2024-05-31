<template>
  <div class="mt-2">
    <div class="mt-2" style="display: grid;grid-template-columns: repeat(2,minmax(0,1fr));grid-gap: 16px">
      <v-card @click="flyToChina=true" :color="flyToChina?'primary':''" :dark="flyToChina" elevation="0"
              class="pa-2 px-4 text-body-2 d-flex align-center">
        <v-icon>mdi-airplane-landing</v-icon>
        <v-spacer></v-spacer>
        飞往国内
      </v-card>
      <v-card @click="flyToChina=false" :color="flyToChina?'':'primary'" :dark="!flyToChina" elevation="0"
              class=" pa-4 px-4 text-body-2 d-flex align-center">
        <v-icon>mdi-airplane-takeoff</v-icon>
        <v-spacer></v-spacer>
        飞往海外
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "FlyToChinaSelector",
  props: {
    value: {},
  },
  watch: {
    value(val) {
      this.flyToChina = val
    },
    flyToChina(val) {
      this.$emit('update:value', val)
    }
  },
  data() {
    return {
      flyToChina: false
    }
  }
}
</script>

<style scoped>

</style>
