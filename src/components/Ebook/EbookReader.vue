<template>
  <div class="ebook-read">
    <div id="read"></div>
    <div class="ebook-read-mask"
    @click="onMaskClick"
    @touchmove="move"
    @touchend="moveEnd"
    ></div>
  </div>
</template>
<script>
import { ebookMixin } from '../../utils/mixin'
import Epub from 'epubjs'
import {
  getFontFamily,
  saveFontFamily,
  saveFontSize,
  getFontSize,
  getTheme,
  saveTheme,
  getLocation
} from '../../utils/localStorage'
import { flatten } from '../../utils/book'
global.epub = Epub
export default {
  // 用mixins对重复的代码进行集成  如mapGetters mapActions
  mixins: [ebookMixin],
  methods: {
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    toggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    initFontFamily() {
      // 先获取localSt中的fontfamily 确认字体是否存在
      let font = getFontFamily(this.fileName)
      if (!font) {
        // font不存在 则将当前默认的字体保存到localStorage中
        saveFontFamily(this.fileName, this.defaultFontFamily)
        font = getFontFamily(this.fileName)
      }
      // 如果字体存在 就渲染该字体
      this.currentBook.rendition.themes.font(font)
      this.setDefaultFontFamily(font)
    },
    initFontSize() {
      // 先获取localSt中的fontSize 确认字体是否存在
      const fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        // font不存在 则将当前默认的字体大小保存到localStorage中
        saveFontSize(this.fileName, this.defaultFontSize)
      }
      // 如果字体大小存在 就渲染该字体大小
      this.currentBook.rendition.themes.fontSize(fontSize)
      this.setDefaultFontSize(fontSize)
    },
    initTheme() {
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      this.themeList.forEach(theme => {
        // 先注册所有的主题
        this.rendition.themes.register(theme.name, theme.style)
      })
      // 设置主题
      this.rendition.themes.select(defaultTheme)
    },
    // 渲染电子书
    initRendition() {
      // 通过renderTo对电子书进行渲染
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight,
        // 微信兼容设置
        method: 'default'
      })
      // 从缓存中获取最新的location
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initFontFamily()
        this.initFontSize()
        this.initTheme()
        this.initGlobalStyle()
      })
      // 将静态资源服务器里面的字体css文件引入 否则无法切换字体
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RESOURCE_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RESOURCE_URL}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RESOURCE_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RESOURCE_URL}/fonts/tangerine.css`
          )
        ]).then(() => {})
      })
    },
    onMaskClick(e) {
      const offsetX = e.offsetX
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage()
      } else {
        this.toggleTitleAndMenu()
      }
    },
    move(e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    moveEnd(e) {
      this.setOffsetY(0)
      this.firstOffsetY = null
    },
    // 手势操作
    initGesture() {
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const touchTime = event.timeStamp - this.touchStartTime
        if (touchTime < 500 && offsetX > 40) {
          // 上一页
          this.prevPage()
        } else if (touchTime < 500 && offsetX < -40) {
          // 下一页
          this.nextPage()
        } else {
          // 标题栏和菜单栏的显示与隐藏
          this.toggleTitleAndMenu()
        }
        event.preventDefault()
        event.stopPropagation()
      })
    },
    parseBook() {
      this.book.loaded.cover.then(cover => {
        // 生成电子书封面的链接
        this.book.archive.createUrl(cover).then(url => {
          // 设置封面
          this.setCover(url)
        })
      })
      this.book.loaded.metadata.then(metadata => {
        // 电子书元信息(介绍 标题 作者 简介等)
        this.setMetadata(metadata)
      })
      // 获取电子书的目录信息
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc)
        // 递归实现
        function find(item, level = 0) {
          return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
        }
        navItem.forEach(item => {
          item.level = find(item)
        })
        // 将降维之后的数组保存到vuex中
        this.setNavigation(navItem)
      })
    },
    // 初始化电子书
    initEpub() {
      // 电子书的静态资源地址
      const url =
        process.env.VUE_APP_RESOURCE_URL + '/epub/' + this.fileName + '.epub'
      // 创建一个book实例化对象 解析电子书
      this.book = new Epub(url)
      // 调用mixins中的setCurrentBook方法将book对象保存到vuex中
      this.setCurrentBook(this.book)
      this.initRendition()
      // this.initGesture()
      this.parseBook()
      // 电子书渲染完毕后执行
      this.book.ready
        .then(() => {
          // 模糊分页算法
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          )
        })
        .then(locations => {
          // bookAvailadble设置为true 进度条可以拖动了
          this.setBookAvailable(true)
          this.refreshLocation()
        })
    }
  },
  mounted() {
    this.setFileName(this.$route.params.filename.split('|').join('/')).then(
      () => {
        this.initEpub()
      }
    )
  }
}
</script>
<style lang="scss" scoped>
.ebook-read {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-read-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    background: transparent;
    width: 100%;
    height: 100%;
  }
}
</style>
