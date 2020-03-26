<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{text}}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <book-mark :color="color" :width="15" :height="35"></book-mark>
    </div>
  </div>
</template>
<script>
import BookMark from '../Common/BookMark'
import { ebookMixin } from '../../utils/mixin'
import { realPx } from '../../utils/util'
import { getBookMark, saveBookMark } from '../../utils/localStorage'
const white = '#fff'
const blue = '#346cbc'
export default {
  mixins: [ebookMixin],
  data() {
    return {
      text: '',
      color: white,
      isFixed: false
    }
  },
  components: {
    BookMark
  },
  computed: {
    height() {
      return realPx(35)
    },
    // 极限高度
    threshold() {
      return realPx(55)
    },
    // 固定定位的样式
    fixedStyle() {
      return {
        position: 'fixed',
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      }
    }
  },
  watch: {
    offsetY(v) {
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return false
      }
      if (v > this.height && v < this.threshold) {
        this.beforeThreshold(v)
      } else if (v >= this.threshold) {
        this.aftreThreshold(v)
      } else if (v > 0 && v < this.height) {
        this.beforeHeight(v)
      } else if (v === 0) {
        this.restore()
      }
    },
    isBookMark(isBookMark) {
      this.isFixed = isBookMark
      if (isBookMark) {
        this.color = blue
      } else {
        this.color = white
      }
    }
  },
  methods: {
    // 添加书签
    addBookMark() {
      // 先检查缓存里是否有书签
      this.bookmark = getBookMark(this.fileName)
      if (!this.bookmark) {
        this.bookmark = []
      }
      const currentLocation = this.currentBook.rendition.currentLocation()
      // 利用正则表达式拼接cfi范围获得当前书签的文本
      const basecfi = currentLocation.start.cfi.replace(/!.*/, '')
      const startcfi = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
      const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
      const cfirange = `${basecfi}!,${startcfi},${cfiend})`
      this.currentBook.getRange(cfirange).then(range => {
        // 替换掉多余的空格
        const text = range.toString().replace(/\s\s/g, '')
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text: text
        })
        // 保存书签到缓存中
        saveBookMark(this.fileName, this.bookmark)
      })
    },
    // 删除书签
    removeBookMark() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      this.bookmark = getBookMark(this.fileName)
      if (this.bookmark) {
        saveBookMark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi))
        this.setIsBookMark(false)
      }
    },
    beforeHeight(v) {
      // 状态1: 下拉高度没有超过书签的高度
      if (this.isBookMark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = blue
        this.isFixed = true
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = white
        this.isFixed = false
      }
    },
    beforeThreshold(v) {
      // 状态2 超过书签高度，但是没有达到临界状态
      this.$refs.bookmark.style.top = `${-v}px`
      this.beforeHeight()
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
    },
    aftreThreshold(v) {
      // 状态3:超过临界状态
      if (this.isBookMark) {
        this.$refs.bookmark.style.top = `${-v}px`
        this.text = this.$t('book.releaseDeleteMark')
        this.color = white
        this.isFixed = false
      } else {
        this.$refs.bookmark.style.top = `${-v}px`
        this.text = this.$t('book.releaseAddMark')
        this.color = blue
        this.isFixed = true
      }
      const iconDown = this.$refs.iconDown
      if (
        iconDown.style.transform === '' ||
        iconDown.style.transform === 'rotate(0deg)'
      ) {
        iconDown.style.transform = 'rotate(180deg)'
      }
    },
    // 状态4: 归位
    restore() {
      setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      }, 200)
      if (this.isFixed) {
        this.setIsBookMark(true)
        this.addBookMark()
      } else {
        this.setIsBookMark(false)
        this.removeBookMark()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.ebook-bookmark {
  position: absolute;
  top: px2rem(-35);
  left: 0;
  z-index: 150;
  width: 100%;
  height: px2rem(35);
  .ebook-bookmark-text-wrapper {
    display: flex;
    position: absolute;
    right: px2rem(45);
    bottom: 0;
    .ebook-bookmark-down-wrapper {
      font-size: px2rem(14);
      color: white;
      transition: all 0.2s linear;
      @include center;
    }
    .ebook-bookmark-text {
      font-size: px2rem(14);
      color: white;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: px2rem(15);
  }
}
</style>
