<!--书架分类列表组件-->
<template>
  <div class="store-shelf">
    <!--标题-->
    <shelf-title :title="shelfCategory.title"></shelf-title>
    <scroll
      :top="0"
      :bottom="scrollBottom"
      class="store-shelf-scroll-wrapper"
      @onScroll="onScroll"
      ref="scroll"
      v-if="ifShowList"
    > <!--分类列表-->
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
    </scroll>
    <div class="store-shelf-empty-view" v-else>{{$t('shelf.groupNone')}}</div>
    <!--底部菜单组件-->
    <shelf-footer></shelf-footer>
  </div>
</template>
<script>
import ShelfTitle from '@/components/shelf/ShelfTitle'
import Scroll from '@/components/Common/Scroll'
import ShelfList from '@/components/shelf/ShelfList'
import ShelfFooter from '@/components/shelf/ShelfFooter'
import { storeShelfMixin } from '../../utils/mixin'
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfList,
    ShelfFooter
  },
  computed: {
    ifShowList() {
      // 分类列表展示的条件
      return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
    }
  },
  data() {
    return {
      scrollBottom: 0
    }
  },
  watch: {
    // 监听是否为编辑模式
    isEditMode(isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0
      this.$nextTick(() => {
        // 刷新滚动条，使得设置生效
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
  created() {
    // 获取电子书分类列表
    this.getCategoryList(this.$route.query.title)
    // 标记currentType为2，对于不同的currentType，ShelfTitle将呈现不同状态
    this.setCurrentType(2)
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
  .store-shelf-empty-view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: px2rem(14);
    color: #333;
    @include center;
  }
}
</style>
