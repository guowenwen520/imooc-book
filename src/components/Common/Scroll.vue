<template>
  <div
    class="scroll-wrapper"
    :class="{'no-scroll': ifNoScroll}"
    @scroll.passive="handleScroll"
    ref="scrollWrapper"
  >
    <slot></slot>
  </div>
</template>
<script>
import { realPx } from '../../utils/util'
export default {
  // 通过props接受父组件的值
  props: {
    top: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number,
      default: 0
    },
    ifNoScroll: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 捕捉滚动时Y轴的偏移量
    handleScroll(e) {
      const offsetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop
      // 子组件通过$emit调用父组件定义的onScroll函数
      this.$emit('onScroll', offsetY)
    },
    scrollTo(x, y) {
      this.$refs.scrollWrapper.scrollTo(x, y)
    },
    // 更新滚动条
    refresh() {
      if (this.$refs.scrollWrapper) {
        // 计算滚动条的top值
        this.$refs.scrollWrapper.style.height = window.innerHeight - realPx(this.top) - realPx(this.bottom) + 'px'
        this.$refs.scrollWrapper.addEventListener('scroll', this.handleScroll)
      }
    }
  },
  mounted() {
    this.refresh()
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.scroll-wrapper {
  position: relative;
  z-index: 110;
  width: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  // 解决滚动时的卡顿bug
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
  &.no-scroll {
    overflow: hidden;
  }
}
</style>
