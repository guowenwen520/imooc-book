<template>
  <div class="home-title-wrapper">
    <div class="title-label">{{label}}</div>
    <div class="title-btn" @click="click">{{btn}}</div>
  </div>
</template>
<script>
export default {
  props: {
    label: String,
    btn: String
  },
  methods: {
    click() {
      this.$emit('onClick')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.home-title-wrapper {
  padding: px2rem(15) px2rem(10);
  display: flex;
  justify-content: space-between;
  .title-label {
    font-size: px2rem(18);
    font-weight: bold;
    color: #333;
  }
  .title-btn {
    font-size: px2rem(14);
    color: rgba(64, 158, 255, 1);
    &:active {
      color: rgba(64, 158, 255, 0.5);
    }
  }
}
</style>
