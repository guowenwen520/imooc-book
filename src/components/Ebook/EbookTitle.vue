<template>
  <transition name="slide-down">
    <div class="title-wrapper" v-show="menuVisible">
      <div class="left">
        <span class="icon-back" @click="back"></span>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <span class="icon-shelf" @click="showBookShelf"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-cart"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-more"></span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { ebookMixin } from '../../utils/mixin'
export default {
  methods: {
    back() {
      this.$router.go(-1)
    },
    showBookShelf() {
      this.$router.push('/store/shelf')
    }
  },
  mixins: [ebookMixin]
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.title-wrapper {
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 150;
  width: 100%;
  height: px2rem(48);
  background-color: white;
  box-shadow: 0 px2rem(6) px2rem(6) rgba(0, 0, 0, 0.15);
  font-size: px2rem(20);
  .left {
    display: flex;
    flex: 0 0 px2rem(60);
    @include center;
  }
  .right {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    .icon-wrapper {
      display: flex;
      flex: 0 0 px2rem(40);
      @include center;
      .icon-cart {
        font-size: px2rem(22);
      }
    }
  }
}
</style>
