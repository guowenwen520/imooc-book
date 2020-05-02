<template>
  <div class="ebook" ref="ebook">
    <!--电子书页眉组件-->
    <ebook-header></ebook-header>
    <!--电子书标题组件-->
    <ebook-title></ebook-title>
    <!--电子书阅读部分组件-->
    <ebook-reader></ebook-reader>
    <!--电子书菜单组件-->
    <ebook-menu></ebook-menu>
    <!--书签组件-->
    <ebook-mark></ebook-mark>
    <!--电子书页脚组件-->
    <ebook-footer></ebook-footer>
  </div>
</template>
<script>
import EbookReader from '../../components/Ebook/EbookReader'
import EbookTitle from '../../components/Ebook/EbookTitle'
import EbookMenu from '../../components/Ebook/EbookMenu'
import EbookMark from '../../components/Ebook/EbookBookMark'
import EbookHeader from '../../components/Ebook/EbookHeader'
import EbookFooter from '../../components/Ebook/EbookFooter'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookMark,
    EbookHeader,
    EbookFooter
  },
  watch: {
    // 监听用户滑动屏幕距离顶部的Y偏移量
    offsetY(v) {
      // 判断如果菜单栏没有处于显示状态（如果菜单栏显示，优先响应菜单栏事件）
      // 并且电子书已经解析完毕（未解析完毕时无法获取currentLocation）
      if (!this.menuVisible && this.bookAvailable) {
        if (v > 0) {
          // 向下拉动屏幕，调用move方法
          this.move(v)
        } else if (v === 0) {
          // y轴为0时，调用restore方法让屏幕回弹，松手时屏幕是无法自动回弹的，必须自己实现
          this.restore()
        }
      }
    }
  },
  methods: {
    // 获取阅读时间
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        // 阅读时间不存在 重置时间
        readTime = 0
      }
      // 开启定时器
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    },
    move(v) {
      this.$refs.ebook.style.top = v + 'px'
    },
    restore() {
      // 组件回到原位
      this.$refs.ebook.style.top = 0
      // 回到原位后 有一个过渡动画 回弹效果
      this.$refs.ebook.style.transition = 'all .2s linear'
      setTimeout(() => {
        // 清除过渡动画 否则下拉时也会有动画
        this.$refs.ebook.style.transition = ''
      }, 200)
    }
  },
  mounted() {
    // 开启计算阅读时间的定时任务
    this.startLoopReadTime()
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.ebook {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
