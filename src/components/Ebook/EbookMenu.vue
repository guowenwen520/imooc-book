<template>
  <div>
    <transition name="slide-up">
      <div class="menu-wrapper" v-show="menuVisible" :class="{'box-shadow-hide': !menuVisible || settingVisible >= 0}">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper" @click="showSetting(0)">
          <span class="icon-a">A</span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-prop></ebook-setting-font-prop>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
  </div>
</template>
<script>
import { ebookMixin } from '../../utils/mixin'
import EbookSettingFont from './EbookSettingFont'
import EbookSettingFontProp from './EbookSettingFontProp'
import EbookSettingTheme from './EbookSettingTheme'
import EbookSettingProgress from './EbookSettingProgress'
import EbookSlide from './EbookSlide'
export default {
  mixins: [ebookMixin],
  methods: {
    showSetting(key) {
      this.setSettingVisible(key)
    }
  },
  components: {
    EbookSettingFont,
    EbookSettingFontProp,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.menu-wrapper {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 160;
  width: 100%;
  height: px2rem(48);
  background-color: white;
  box-shadow: 0 px2rem(-6) px2rem(6) rgba(0, 0, 0, 0.15);
  font-size: px2rem(20);
  // &表示与menu-wrapper同级
  &.box-shadow-hide {
    box-shadow: none;
  }
  .icon-wrapper {
    display: flex;
    flex: 1;
    @include center;
    .icon-progress {
      font-size: px2rem(26);
    }
    .icon-bright, .icon-a {
      font-size: px2rem(22);
    }
  }
}
</style>
