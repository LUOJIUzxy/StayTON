<template>
  <div class="text-caption">
    v {{ version }}
  </div>
</template>

<script>
export default {
  name: "VersionDisplay",
  data: function () {
    return {
      version: require('../../../package.json').version,
    };
  }
}
</script>

<style scoped>

</style>
