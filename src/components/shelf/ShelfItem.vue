<template>
  <div
    class="shelf-item"
    :class="{ 'shelf-item-shadow': data.type === 1 || data.type === 2 }"
    @click="onItemClick"
  >
    <component
      :is="item"
      :data="data"
      class="shelf-item-comp"
      :class="{ 'is-Edit': isEditMode && data.type === 2 }"
    ></component>
    <span
      class="icon-selected"
      v-show="isEditMode && data.type === 1"
      :class="{ 'is-selected': data.selected }"
    ></span>
  </div>
</template>
<script>
import ShelfItemBook from '@/components/shelf/ShelfItemBook'
import ShelfItemCategory from '@/components/shelf/ShelfItemCategory'
import ShelfItemAdd from '@/components/shelf/ShelfItemAdd'
import { goToStoreHome } from '../../utils/store'
import { storeShelfMixin } from '../../utils/mixin'
export default {
  mixins: [storeShelfMixin],
  props: {
    data: Object
  },
  data() {
    return {
      book: ShelfItemBook,
      category: ShelfItemCategory,
      add: ShelfItemAdd
    }
  },
  computed: {
    item() {
      // 动态计算要显示的组件
      return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
    }
  },
  methods: {
    onItemClick() {
      if (this.isEditMode) {
        this.data.selected = !this.data.selected
        if (this.data.selected) {
          // 添加的电子书不重复
          this.shelfSelected.pushWithoutDuplicate(this.data)
        } else {
          // 移除电子书
          this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
        }
      } else {
        // 显示电子书详情
        if (this.data.type === 1) {
          this.showBookDetail(this.data)
        } else if (this.data.type === 2) {
          this.$router.push({
            path: '/store/category',
            query: {
              title: this.data.title
            }
          })
        } else {
          goToStoreHome(this)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.shelf-item {
  position: relative;
  width: 100%;
  height: 100%;
  &.shelf-item-shadow {
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, 0.3);
  }
  .shelf-item-comp {
    opacity: 1;
    &.is-Edit {
      opacity: 0.5;
    }
  }
  .icon-selected {
    position: absolute;
    bottom: px2rem(2);
    right: px2rem(2);
    font-size: px2rem(18);
    color: rgba(0, 0, 0, 0.5);
    &.is-selected {
      color: $color-blue;
    }
  }
}
</style>
