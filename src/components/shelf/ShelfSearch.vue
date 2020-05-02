<template>
  <div class="shelf-search-wrapper" :class="{'search-top': ifInputClick, 'hide-shadow': ifHideShadow}">
    <div class="shelf-search" :class="{ 'search-top': ifInputClick }">
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper">
          <input
            type="text"
            class="search-input"
            :placeholder="$t('shelf.search')"
            @click="onSearchClick"
            v-model="searchText"
          />
        </div>
        <div
          class="icon-clear-wrapper"
          v-show="searchText.length > 0"
          @click="clearSeatchText"
        >
          <span class="icon-close-circle-fill"></span>
        </div>
      </div>
      <div
        class="icon-locale-wrapper"
        v-if="!ifInputClick"
        @click="switchLocale"
      >
        <span class="icon-cn icon" v-if="lang === 'cn'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
        <span class="cancel-text">{{ $t('shelf.cancel') }}</span>
      </div>
    </div>
    <transition name="hot-search-move">
      <div class="shelf-search-tab-wrapper" v-show="ifInputClick">
        <div
          class="shelf-search-tab-item"
          v-for="item in tabs"
          :key="item.id"
          @click="onTabClick(item.id)"
        >
          <span
            class="shelf-search-item-context"
            :class="{ 'is-selected': item.id === selectedTab }"
            >{{ item.text }}</span
          >
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { setLocalStorage } from '../../utils/localStorage'
import { storeShelfMixin } from '../../utils/mixin'
export default {
  mixins: [storeShelfMixin],
  data() {
    return {
      // 判断input搜索框是否被点击了
      ifInputClick: false,
      searchText: '',
      // 当前选中的tab栏的id
      selectedTab: 1,
      // 是否显示阴影
      ifHideShadow: true
    }
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0 && this.ifInputClick) {
        // 显示阴影
        this.ifHideShadow = false
      } else {
        this.ifHideShadow = true
      }
    }
  },
  computed: {
    lang() {
      return this.$i18n.locale
    },
    tabs() {
      return [
        {
          id: 1,
          text: this.$t('shelf.default')
        },
        {
          id: 2,
          text: this.$t('shelf.progress')
        },
        {
          id: 3,
          text: this.$t('shelf.purchase')
        }
      ]
    }
  },
  methods: {
    // 点击搜索框
    onSearchClick() {
      this.ifInputClick = true
      // 隐藏书架标题
      this.setShelfTitleVisible(false)
    },
    // 取消点击搜索框
    onCancelClick() {
      this.ifInputClick = false
      // 显示书架标题
      this.setShelfTitleVisible(true)
    },
    // 切换语言
    switchLocale() {
      if (this.lang === 'cn') {
        this.$i18n.locale = 'en'
      } else {
        this.$i18n.locale = 'cn'
      }
      setLocalStorage('locale', this.$i18n.locale)
    },
    // 清除搜索框的内容
    clearSeatchText() {
      this.searchText = ''
    },
    // 切换tab栏时改变字体颜色
    onTabClick(id) {
      this.selectedTab = id
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.shelf-search-wrapper {
  position: relative;
  z-index: 135;
  width: 100%;
  height: px2rem(94);
  font-size: px2rem(16);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
  &.search-top {
    position: fixed;
    top: 0;
    left: 0;
  }
  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-search {
    display: flex;
    position: absolute;
    top: px2rem(42);
    left: 0;
    z-index: 135;
    width: 100%;
    height: px2rem(52);
    transition: top $animationTime linear;
    &.search-top {
      top: 0;
    }
    .search-wrapper {
      display: flex;
      flex: 1;
      margin: px2rem(8) 0 px2rem(8) px2rem(10);
      border: px2rem(1) solid #ccc;
      border-radius: px2rem(3);
      .icon-search-wrapper {
        flex: 0 0 px2rem(22);
        @include right;
        .icon-search {
          font-size: px2rem(12);
        }
      }
      .search-input-wrapper {
        flex: 1;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        @include center;
        .search-input {
          font-size: px2rem(14);
          width: 100%;
          border: none;
          color: #333;
          &:focus {
            outline: none;
          }
          &::-webkit-input-placeholder {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-clear-wrapper {
        flex: 0 0 px2rem(24);
        @include left;
        .icon-close-circle-fill {
          font-size: px2rem(14);
          color: #ccc;
        }
      }
    }
    .icon-locale-wrapper {
      flex: 0 0 px2rem(55);
      @include center;
      .icon-cn,
      .icon-en {
        font-size: px2rem(22);
        color: #666;
      }
    }
    .cancel-btn-wrapper {
      flex: 0 0 px2rem(55);
      @include center;
      .cancel-text {
        font-size: px2rem(14);
        color: $color-blue;
      }
    }
  }
  .shelf-search-tab-wrapper {
    display: flex;
    position: absolute;
    top: px2rem(52);
    left: 0;
    width: 100%;
    height: px2rem(42);
    .shelf-search-tab-item {
      flex: 1;
      @include center;
      .shelf-search-item-context {
        font-size: px2rem(14);
        color: #999;
        &.is-selected {
          color: $color-blue;
        }
      }
    }
  }
}
</style>
