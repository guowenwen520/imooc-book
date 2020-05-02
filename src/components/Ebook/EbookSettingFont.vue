<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 0">
      <!--设置字体大小-->
      <div class="setting-font-size">
        <div class="preview" :style="{fontSize: fontSizeList[0].fontSize + 'px'}">A</div>
        <div class="select">
          <div
            class="select-wrapper"
            v-for="(item, index) in fontSizeList"
            :key="index"
            @click="setFontSize(item.fontSize)"
          >
            <div class="line"></div>
            <div class="point-wrapper">
              <div class="point" v-show="defaultFontSize === item.fontSize">
                <div class="small-point"></div>
              </div>
            </div>
            <div class="line"></div>
          </div>
        </div>
        <div
          class="preview"
          :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}"
        >A</div>
      </div>
      <!--设置字体-->
      <div class="setting-font-family">
        <div class="setting-font-family-text-wrapper" @click="showFontFamilyPopup">
          <span class="setting-font-family-text">{{defaultFontFamily}}</span>
        </div>
        <div class="setting-font-family-icon-wrapper">
          <span class="icon-forward"></span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { fontSizeList } from '../../utils/book'
import { ebookMixin } from '../../utils/mixin'
import { saveFontSize } from '../../utils/localStorage'
export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontSizeList
    }
  },
  methods: {
    setFontSize(fontSize) {
      // 调用mixins中的setDefaultFontSize方法改变vuex中的defaultFontSize值
      this.setDefaultFontSize(fontSize)
      saveFontSize(this.fileName, fontSize)
      // 更改电子书字体的大小
      this.currentBook.rendition.themes.fontSize(fontSize)
    },
    showFontFamilyPopup() {
      // 点击显示设置字体弹出层
      this.setFontFamilyVisible(true)
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
  .setting-font-size {
    display: flex;
    flex: 2;
    height: 100%;
    .preview {
      flex: 0 0 px2rem(40);
      @include center;
    }
    .select {
      flex: 1;
      @include center;
      .select-wrapper {
        display: flex;
        flex: 1;
        align-items: center;
        &:first-child {
          .line {
            &:first-child {
              border-top: none;
            }
          }
        }
        .line {
          flex: 1;
          height: 0;
          border-top: px2rem(1) solid #ccc;
        }
        .point-wrapper {
          position: relative;
          flex: 0 0 0;
          height: px2rem(7);
          border-left: px2rem(1) solid #ccc;
          @include center;
          .point {
            position: absolute;
            left: px2rem(-11);
            top: px2rem(-7.5);
            width: px2rem(20);
            height: px2rem(20);
            border-radius: 50%;
            border: px2rem(1) solid #ccc;
            box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
            @include center;
            .small-point {
              width: px2rem(7);
              height: px2rem(7);
              border-radius: 50%;
              background-color: black;
            }
          }
        }
        &:last-child {
          .line {
            &:last-child {
              border-top: none;
            }
          }
        }
      }
    }
  }
  .setting-font-family {
    flex: 1;
    font-size: px2rem(14);
    @include center;
    .setting-font-family-text-wrapper {
      @include center;
    }
    .setting-font-family-icon-wrapper {
      @include center;
    }
  }
}
</style>
