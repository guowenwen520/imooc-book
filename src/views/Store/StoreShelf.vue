<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <scroll
      :top="0"
      :bottom="scrollBottom"
      class="store-shelf-scroll-wrapper"
      @onScroll="onScroll"
      ref="scroll"
    >
      <shelf-search></shelf-search>
      <shelf-list :data="shelfList"></shelf-list>
      <shelf-footer></shelf-footer>
    </scroll>
  </div>
</template>
<script>
import ShelfTitle from '@/components/shelf/ShelfTitle'
import Scroll from '@/components/Common/Scroll'
import ShelfSearch from '@/components/shelf/ShelfSearch'
import ShelfList from '@/components/shelf/ShelfList'
import ShelfFooter from '@/components/shelf/ShelfFooter'
import { storeShelfMixin } from '../../utils/mixin'
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
    ShelfFooter
  },
  data() {
    return {
      scrollBottom: 0
    }
  },
  watch: {
    isEditMode(isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  },
  methods: {
    // 动态改变vuex中的offsetY值
    onScroll(offsetY) {
      this.setOffsetY(offsetY)
    }
  },
  mounted() {
    // 获取书架列表数据
    this.getShelfList()
    // 初始化书架分类数据
    this.setShelfCategory([])
    // 设置vuex的currentType为1，表示当前位于书架，影响ShelfTitle状态
    this.setCurrentType(1)
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.store-shelf {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .store-shelf-scroll-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 101;
  }
}
</style>
