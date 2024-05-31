<template>
  <div style="width: 100vw;height: 100vh;"
       class="d-flex align-center justify-center">
    <lottie-web-vue-esm
        loop
        :animation-data="require('@/assets/search.json')"
    />
  </div>
</template>

<script>
import LottieWebVueEsm from 'lottie-web-vue'

export default {
  name: "LoadingPage",
  components: {
    LottieWebVueEsm
  },
  mounted() {
    setTimeout(() => {
      this.$router.push('/')
    }, 2000)
  }
}
</script>

<style scoped>

</style>
