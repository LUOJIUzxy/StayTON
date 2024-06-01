<template>
  <v-card  style="user-select: none;border-radius: 16px"
          elevation="0">
    <div @click="$emit('click')" class="py-4 px-3">
      <order-general-display :t="t"/>
      <div class="mt-4 d-flex align-center">
        <v-btn elevation="0" dark>
          <v-icon left>mdi-lock</v-icon>
          Check In
        </v-btn>
        <v-spacer></v-spacer>
        <div class="text--secondary d-flex align-center">
          <v-icon small left color="grey lighten-2">mdi-information-outline</v-icon>
          <div class="text-caption">Click to show QR Code!</div>
        </div>

      </div>
    </div>
  </v-card>
</template>

<script>




import OrderGeneralDisplay from "@/views/widgets/items/OrderGeneralDisplay.vue"

export default {
  name: "OrderCard",
  components: {OrderGeneralDisplay},
  props: {
    t: {}
  },
}
</script>

<style scoped>

</style>
