<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hideFontFamilySetting">
          <span class="icon-down2"></span>
        </div>
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popub-item" v-for="(item, index) in fontFamilyList" :key="index" @click="setFontFamily(item.font)">
          <div class="ebook-popup-item-text" :class="{'selected': isSelected(item.font)}">{{item.font}}</div>
          <div class="ebook-popub-item-checked">
            <span class="icon-check" v-if="isSelected(item)"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { ebookMixin } from '../../utils/mixin'
// 导入字体集合
import { fontFamilyList } from '../../utils/book'
// 引入保存字体到localStorage的方法
import { saveFontFamily } from '../../utils/localStorage'
export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontFamilyList
    }
  },
  methods: {
    isSelected(font) {
      return this.defaultFontFamily === font
    },
    // 设置字体类型
    setFontFamily(font) {
      // 将vuex中的默认字体改成被点击项的字体 让被选择的字体高亮显示
      this.setDefaultFontFamily(font)
      // 将当前字体进行缓存
      saveFontFamily(this.fileName, font)
      if (font === 'Default') {
        this.currentBook.rendition.themes.font('Times New Roman')
      }
      this.currentBook.rendition.themes.font(font)
    },
    // 点击朝下的小图标 隐藏设置字体的弹出层
    hideFontFamilySetting() {
      this.setFontFamilyVisible(false)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.ebook-popup-list {
  position: absolute;
  bottom: 0;
  left: o;
  z-index: 150;
  width: 100%;
  background-color: white;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, 0.15);
  .ebook-popup-title {
    position: relative;
    padding: px2rem(15);
    border-bottom: px2rem(1) solid #b8b9bb;
    box-sizing: border-box;
    font-weight: bold;
    text-align: center;
    @include center;
    .ebook-popup-title-icon {
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: 100%;
      font-size: px2rem(16);
      @include center;
    }
    .ebook-popup-title-text {
      font-size: px2rem(14);
    }
  }
  .ebook-popup-list-wrapper {
    .ebook-popub-item {
      display: flex;
      padding: px2rem(15);
      font-size: px2rem(14);
      .ebook-popup-item-text {
        flex: 1;
        text-align: left;
        &.selected {
          color: #346cb9;
          font-weight: bold;
        }
      }
      .ebook-popub-item-checked {
        flex: 1;
        text-align: right;
        color: #346cb9;
      }
    }
  }
}
</style>
