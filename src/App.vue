<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
})
export default {
  mounted() {},
  computed: {}
}
</script>
<style lang="scss" scoped>
@import './assets/style/global.scss';
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
