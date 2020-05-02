<template>
  <div class="ebook-header">
    <span class="ebook-header-text">{{getSectionName}}</span>
  </div>
</template>
<script>
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin]
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.ebook-header {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  width: 100%;
  height: px2rem(36);
  padding: 0 px2rem(15) 0 px2rem(18);
  overflow: hidden;
  box-sizing: border-box;
  @include left;
  .ebook-header-text {
    font-size: px2rem(12);
    color: #6d7178;
  }
}
</style>
