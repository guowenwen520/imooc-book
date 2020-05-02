import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, removeAllCss, getReadTimeByMinute } from './book'
import { saveLocation, getBookMark, getBookShelf, saveBookShelf } from './localStorage'
import { goToBookDetail, appendAddToShelf, computeId, removeAddFromShelf } from '../utils/store'
import { shelf } from '../api/store'
// 阅读器mixin
export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'currentBook',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'progress',
      'bookAvailable',
      'section',
      'cover',
      'metadata',
      'navigation',
      'offsetY',
      'isBookMark'
    ]),
    themeList() {
      return themeList(this)
    },
    getSectionName() {
      if (this.section && this.navigation) {
        return this.navigation[this.section].label
      }
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setCurrentBook',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setProgress',
      'setBookAvailable',
      'setSection',
      'setCover',
      'setMetadata',
      'setNavigation',
      'setOffsetY',
      'setIsBookMark'
    ]),
    initGlobalStyle() {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setSection(currentLocation.start.index)
        this.setProgress(Math.floor(progress * 100))
        saveLocation(this.fileName, startCfi)
        const bookmark = getBookMark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookMark(true)
          } else {
            this.setIsBookMark(false)
          }
        } else {
          this.setIsBookMark(false)
        }
      }
    },
    display(target, cb) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    hideTitleAndMenu() {
      // 隐藏菜单栏
      this.setMenuVisible(false)
      // 隐藏设置字号菜单栏
      this.setSettingVisible(-1)
      // 隐藏设置字体菜单栏
      this.setFontFamilyVisible(false)
    },
    getReadTimeText() {
      return this.$t('book.haveRead').replace(
        '$1',
        getReadTimeByMinute(this.fileName)
      )
    }
  }
}
// 书城首页mixin
export const storeHomeMixin = {
  computed: {
    ...mapGetters(['offsetY', 'hotSearchOffsetY', 'flapCardVisible'])
  },
  methods: {
    ...mapActions(['setOffsetY', 'setHotSearchOffsetY', 'setFlapCardVisible']),
    showBookDetail(book) {
      goToBookDetail(this, book)
    }
  }
}
// 书架mixin
export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfSelected',
      'shelfTitleVisible',
      'shelfList',
      'offsetY',
      'shelfCategory',
      'currentType'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setShelfList',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType'
    ]),
    showBookDetail(book) {
      goToBookDetail(this, book)
    },
    getCategoryList(title) {
      // 先获取本地的电子书列表
      this.getShelfList()
      if (this.shelfList) {
        // 筛选出title对应的图书列表
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      } else {
        return false
      }
    },
    // 获取书架列表数据
    getShelfList() {
      // 先从本地localStorage中获取电子书
      let shelfList = getBookShelf()
      if (!shelfList) {
        // 如果本地没有  再从接口中获取数据 所以刷新页面时被修改的电子书数据没有得到保存
        shelf().then(response => {
          if (
            response.status === 200 &&
            response.data &&
            response.data.bookList
          ) {
            // 向书架列表中追加一组数据
            shelfList = appendAddToShelf(response.data.bookList)
            saveBookShelf(shelfList)
            // 保存到vuex中
            this.setShelfList(shelfList)
          }
        })
      } else {
        this.setShelfList(shelfList)
      }
    },
    moveOutOfGroup(f) {
      this.setShelfList(this.shelfList.map(book => {
        if (book.type === 2 && book.itemList) {
          book.itemList = book.itemList.filter(subBook => !subBook.selected)
        }
        return book
      })).then(() => {
        // type！==3的电子书
        // let list = removeAddFromShelf(this.shelfList)
        // list和选中的电子书进行合并
        // list = [].concat(list, ...this.shelfSelected)
        // 添加图书的item项
        // list = appendAddToShelf(list)
        const list = computeId(appendAddToShelf([].concat(
          removeAddFromShelf(this.shelfList), ...this.shelfSelected)))
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          if (f) f()
        })
      })
    }
  }
}
