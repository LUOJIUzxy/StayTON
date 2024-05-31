<template>
  <div>
    <div class="d-flex align-start">
      <div>
        <div class="text-body-1 ">
          <slot></slot>
        </div> 

      </div>
      <v-spacer></v-spacer>
      <div class="text-body-2 font-weight-bold">
        <slot name="value"></slot>
      </div>
    </div>
    <div class="text-caption">
      <slot name="append">

      </slot>
    </div>
    <v-divider class="my-4"></v-divider>
  </div>
</template>

<script>
export default {
  name: "InfoLine"
}
</script>

<style scoped>

</style>
