<template>
  <div class="ebook-footer">
    <span class="ebook-footer-text">{{this.progress + '%'}}</span>
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
.ebook-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  height: px2rem(36);
  padding: 0 px2rem(15) 0 px2rem(18);
  overflow: hidden;
  box-sizing: border-box;
  @include right;
  .ebook-footer-text {
    font-size: px2rem(12);
    color: #6d7178;
  }
}
</style>
