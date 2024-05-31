<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-img :src="item.imageUrl"></v-img>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-subtitle>
        <span class="text-caption text-capitalize mb-n1">
          {{ item.side || 'Matches' }}
        </span>
      </v-list-item-subtitle>
      <v-list-item-title class="mt-n1">
        {{ item.item_name }}
      </v-list-item-title>

      <v-list-item-subtitle>
        <strong class="success--text darken-2">&times; {{ item.quantity }}</strong>
        <span> @ {{ item.price | priceDisplay }}</span>
      </v-list-item-subtitle>

    </v-list-item-content>
    <slot></slot>
  </v-list-item>
</template>

<script>
export default {
  name: "OrderListItem",
  props: {
    item: {}
  },

}
</script>

<style scoped>

</style>
