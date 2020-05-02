<template>
  <transition name="fade">
    <div class="slide-content-wrapper" v-show="menuVisible && settingVisible === 3">
      <transition name="slide-right">
        <div class="content" v-if="settingVisible === 3">
          <div class="content-page-wrapper" v-if="bookAvailable">
            <div class="content-page">
              <component :is="currentTab === 1 ? content : bookmark"></component>
            </div>
            <div class="content-page-tab">
              <div
                class="content-page-tab-item"
                :class="{'selected': currentTab === 1}"
                @click="selectTab(1)"
              >{{$t('book.navigation')}}</div>
              <div
                class="content-page-tab-item"
                :class="{'selected': currentTab === 2}"
                @click="selectTab(2)"
              >{{$t('book.bookmark')}}</div>
            </div>
          </div>
          <div class="content-empty" v-else>
            <ebook-loading></ebook-loading>
          </div>
        </div>
      </transition>
      <div class="content-bg" @click="hideTitleAndMenu"></div>
    </div>
  </transition>
</template>
<script>
import { ebookMixin } from '../../utils/mixin'
import EbookSlideContents from './EbookSlideContents'
import EbookSlideBookMark from './EbookSlideBookMark'
import EbookLoading from './EbookLoading'
export default {
  mixins: [ebookMixin],
  data() {
    return {
      currentTab: 1,
      content: EbookSlideContents,
      bookmark: EbookSlideBookMark
    }
  },
  components: {
    EbookLoading
  },
  methods: {
    selectTab(key) {
      this.currentTab = key
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.slide-content-wrapper {
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1561;
  width: 100%;
  height: 100%;
  .content {
    flex: 0 0 85%;
    width: 85%;
    height: 100%;
    .content-page-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      .content-page {
        flex: 1;
      }
      .content-page-tab {
        display: flex;
        flex: 0 0 px2rem(48);
        width: 100%;
        .content-page-tab-item {
          flex: 1;
          font-size: px2rem(12);
          @include center;
        }
      }
    }
    .content-empty {
      width: 100%;
      height: 100%;
      @include center;
    }
  }
  .content-bg {
    flex: 0 0 15%;
  }
}
</style>
