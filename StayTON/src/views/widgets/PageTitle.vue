<template>
  <div class="d-flex align-center">
    <div class="mr-4">
      <slot name="backButton"></slot>
    </div>
    <div>
      <div class="text-body-1 font-weight-black">
        <slot></slot>
      </div>
      <div class="text-body-2">
        <slot name="subtitle"></slot>
      </div>

    </div>
  </div>

</template>

<script>
export default {
  name: "PageTitle"
}
</script>

<style scoped>

</style>
