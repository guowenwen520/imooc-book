<template>
  <div>
    <div
      class="search-bar"
      :class="{ 'hide-title': !titleVisible, 'hide-shadow': shadowVisible }"
    >
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text-title title">{{ $t('home.title') }}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div
        class="title-icon-back-wrapper"
        :class="{ 'hide-title': !titleVisible }"
        @click="back"
      >
        <span class="icon-back icon"></span>
      </div>
      <div
        class="search-bar-input-wrapper"
        :class="{ 'hide-title': !titleVisible }"
      >
        <!--占位DOM 用来改变搜索框的宽度-->
        <div
          class="search-bar-blank"
          :class="{ 'hide-title': !titleVisible }"
        ></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input
            type="text"
            class="input"
            :placeholder="$t('home.hint')"
            v-model="searchText"
            @click="showHotSearch"
            @keyup.13.exact="search"
          />
        </div>
      </div>
    </div>
    <hot-search-list
      v-show="hotSearchVisible"
      ref="hotSearch"
    ></hot-search-list>
  </div>
</template>
<script>
import { storeHomeMixin } from '../../utils/mixin'
import HotSearchList from '../../components/Home/HotSearchList'
export default {
  mixins: [storeHomeMixin],
  data() {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    }
  },
  components: {
    HotSearchList
  },
  // 监听offsetY
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    hotSearchOffsetY(hotSearchOffsetY) {
      if (hotSearchOffsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    search() {
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    showFlapCard() {
      this.setFlapCardVisible(true)
    },
    showHotSearch() {
      this.hotSearchVisible = true
      this.hideTitle()
      // 当DOM元素渲染完毕后才调用此方法
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
    },
    hideHotSearch() {
      this.hotSearchVisible = false
      if (this.offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    back() {
      if (this.offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
      if (this.hotSearchVisible) {
        this.hideHotSearch()
      } else {
        this.$router.push('/store/shelf')
      }
    },
    hideTitle() {
      this.titleVisible = false
    },
    showTitle() {
      this.titleVisible = true
    },
    showShadow() {
      this.shadowVisible = true
    },
    hideShadow() {
      this.shadowVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.search-bar {
  position: relative;
  z-index: 200;
  width: 100%;
  height: px2rem(94);
  &.hide-title {
    height: px2rem(52);
  }
  &.hide-shadow {
    box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  }
  .search-bar-title-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: px2rem(42);
    .title-text-wrapper {
      width: 100%;
      @include center;
      height: px2rem(42);
      font-size: px2rem(20);
    }
    .title-icon-shake-wrapper {
      position: absolute;
      top: 0;
      height: px2rem(42);
      right: px2rem(15);
      @include center;
    }
  }
  .title-icon-back-wrapper {
    position: absolute;
    top: 0;
    left: px2rem(15);
    z-index: 250;
    height: px2rem(42);
    @include center;
    transition: height $animationTime $animationType;
    &.hide-title {
      height: px2rem(52);
    }
  }
  .search-bar-input-wrapper {
    display: flex;
    position: absolute;
    left: 0;
    top: px2rem(42);
    width: 100%;
    height: px2rem(52);
    padding: px2rem(10);
    box-sizing: border-box;
    transition: top $animationTime $animationType;
    @include left;
    &.hide-title {
      top: 0;
    }
    .search-bar-blank {
      flex: 0 0 0;
      width: 0;
      transition: all $animationTime $animationType;
      &.hide-title {
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input {
      flex: 1;
      border-radius: px2rem(20);
      background-color: #f4f4f4;
      padding: px2rem(5) px2rem(15);
      box-sizing: border-box;
      border: px2rem(1) solid #eee;
      @include left;
      .icon-search {
        color: #999;
      }
      .input {
        width: 100%;
        height: px2rem(22);
        border: none;
        background: transparent;
        margin-left: px2rem(10);
        font-size: px2rem(12);
        color: #666;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #ccc;
        }
      }
    }
  }
}
</style>
