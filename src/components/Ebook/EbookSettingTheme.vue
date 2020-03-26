<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 1">
      <div class="setting-theme">
        <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index" @click="setTheme(index)">
          <div class="theme-item-preview" :style="{background: item.style.body.background}" :class="{'selected': item.name === defaultTheme}">
          </div>
          <div class="theme-item-text" :class="{'selected': item.name === defaultTheme}">{{item.alias}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { ebookMixin } from '../../utils/mixin'
import { saveTheme } from '../../utils/localStorage'
export default {
  mixins: [ebookMixin],
  methods: {
    setTheme(index) {
      const theme = this.themeList[index].name
      // 将vuex中的theme进行更改
      this.setDefaultTheme(theme).then(() => {
        // 渲染当前主题
        this.currentBook.rendition.themes.select(this.defaultTheme)
        this.initGlobalStyle()
      })
      // 将当前主题进行缓存
      saveTheme(this.fileName, theme)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
  .setting-wrapper {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  width: 100%;
  z-index: 101;
  height: px2rem(90);
  background-color: white;
  box-shadow: 0 px2rem(-6) px2rem(6) rgba(0, 0, 0, 0.15);
  .setting-theme {
    display: flex;
    height: 100%;
    .setting-theme-item {
      display: flex;
      flex: 1;
      padding: px2rem(5);
      flex-direction: column;
      .theme-item-preview {
        flex: 1;
        border: px2rem(1) solid #ccc;
        &.selected {
          box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .1);
        }
      }
      .theme-item-text {
        flex: 0 0 px2rem(20);
        font-size: px2rem(14);
        @include center;
        color: #ccc;
        &.selected {
          color: #333;
        }
      }
    }
  }
}
</style>
