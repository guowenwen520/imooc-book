<template>
  <div class="shelf-list" :style="{top: shelfListTop}">
    <!--使用transition-group 一定不能忘了:key="item.id"-->
    <transition-group name="list" tag="div" id="shelf-list">
      <div class="shelf-list-item-wrapper" v-for="item in data" :key="item.id">
        <shelf-item :data="item" :style="{ height: itemHeight }"></shelf-item>
        <div class="shelf-item-title-wrapper">
          <span class="shelf-item-title-context title-small">
            {{
            item.title
            }}
          </span>
        </div>
      </div>
    </transition-group>
  </div>
</template>
<script>
import ShelfItem from '@/components/shelf/ShelfItem'
import { storeShelfMixin } from '../../utils/mixin.js'
import { realPx, px2rem } from '../../utils/util'
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfItem
  },
  props: {
    top: {
      type: Number,
      default: 94
    },
    data: Array
  },
  computed: {
    // item-wrapper的高度 高度自适应
    itemHeight() {
      return ((window.innerWidth - realPx(120)) / 3 / 250) * 350 + 'px'
    },
    shelfListTop() {
      return px2rem(this.top) + 'rem'
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.shelf-list {
  position: absolute;
  left: 0;
  z-index: 100;
  width: 100%;
  #shelf-list {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .shelf-list-item-wrapper {
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: px2rem(15);
      box-sizing: border-box;
      &.list-leave-active {
        display: none;
      }
      &.list-move {
        transition: transform 0.5s;
      }
      .shelf-list-title-wrapper {
        margin-top: px2rem(10);
      }
    }
  }
}
</style>
