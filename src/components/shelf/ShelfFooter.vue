<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div
      class="shelf-footer-tab-wrapper"
      v-for="item in tabs"
      :key="item.index"
      @click="onTabClick(item)"
    >
      <div class="shelf-tab-wrapper" :class="{ 'is-selected': isSelected }">
        <div
          class="icon-private tab-icon"
          v-if="item.index === 1 && !isPrivate"
        ></div>
        <div
          class="icon-private-see tab-icon"
          v-if="item.index === 1 && isPrivate"
        ></div>
        <div
          class="icon-download tab-icon"
          v-if="item.index === 2 && !isDownload"
        ></div>
        <div
          class="icon-download-remove tab-icon"
          v-if="item.index === 2 && isDownload"
        ></div>
        <div class="icon-move tab-icon" v-if="item.index === 3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
        <div class="tab-text" :class="{ 'remove-text': item.index === 4 }">
          {{ label(item) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { storeShelfMixin } from '../../utils/mixin'
import { saveBookShelf, removeLocalStorage } from '../../utils/localStorage'
import { removeLocalForage } from '../../utils/localForage'
import { download } from '../../api/store'
export default {
  mixins: [storeShelfMixin],
  data() {
    return {
      popupMenu: null
    }
  },
  computed: {
    tabs() {
      return [
        {
          label: this.$t('shelf.private'),
          label2: this.$t('shelf.noPrivate'),
          index: 1
        },
        {
          label: this.$t('shelf.download'),
          label2: this.$t('shelf.delete'),
          index: 2
        },
        {
          label: this.$t('shelf.move'),
          index: 3
        },
        {
          label: this.$t('shelf.remove'),
          index: 4
        }
      ]
    },
    // 判断电子书是否处于选中状态
    isSelected() {
      return this.shelfSelected && this.shelfSelected.length > 0
    },
    // 是否是私密阅读状态
    isPrivate() {
      if (!this.isSelected) {
        return false
      } else {
        return this.shelfSelected.every(item => item.private)
      }
    },
    // 是否已经缓存
    isDownload() {
      if (!this.isSelected) {
        return false
      } else {
        return this.shelfSelected.every(item => item.cache)
      }
    }
  },
  methods: {
    // 私密阅读业务逻辑
    setPrivate() {
      let isPrivate
      if (this.isPrivate) {
        // 不是私密阅读状态 需要开启私密阅读
        isPrivate = false
      } else {
        // 已经是私密阅读状态
        isPrivate = true
      }
      this.shelfSelected.forEach(book => {
        // 只要有一本书不是私密状态，改变被选择的电子书的私密状态
        book.private = isPrivate
      })
      this.onComplute()
      if (isPrivate) {
        this.simpleToast(this.$t('shelf.setPrivateSuccess'))
      } else {
        this.simpleToast(this.$t('shelf.closePrivateSuccess'))
      }
    },
    hidePopup() {
      this.popupMenu.hide()
    },
    onComplute() {
      // 隐藏弹出框
      this.hidePopup()
      // 退出编辑模式
      this.setIsEditMode(false)
      // 将修改后的信息保存到localStorage
      saveBookShelf(this.shelfList)
    },
    removeSelectedBook() {
      // 一次性全部移除 不按顺序
      Promise.all(this.shelfSelected.map(book => this.removeBook(book))).then(books => {
        // books接收的是resolve(book)里的电子书，即已经被移除缓存的电子书，缓存状态要改成false
        books.map(book => {
          book.cache = false
        })
        saveBookShelf(this.shelfList)
        // 提示移除缓存成功
        this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
      })
    },
    removeBook(book) {
      return new Promise((resolve, reject) => {
        // 删除localStorage的电子书
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
        // 删除indexDB里的缓存
        removeLocalForage(`${book.fileName}`)
        resolve(book)
      })
    },
    // 下载被选择的电子书
    async downloadSelectedBook() {
      // 一本一本的下载，可以看到每一本的下载进度
      for (let i = 0; i < this.shelfSelected.length; i++) {
        await this.downLoadBook(this.shelfSelected[i]).then(book => {
          // 下载完毕后 将是否已经缓存设置为true
          book.cache = true
        })
      }
    },
    // 下载电子书业务逻辑
    downLoadBook(book) {
      let text = ''
      // 持续显示下载进度的弹出层
      const toast = this.toast({
        text
      })
      toast.continueShow()
      return new Promise((resolve, reject) => {
        download(book, book => {
          // 下载完毕后 移除toast
          toast.remove()
          resolve(book)
        }, reject, progressEvent => {
          // 进度百分比格式化
          const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
          text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
          // 更新toast中的文本
          toast.updateText(text)
        })
      })
    },
    // 离线缓存业务逻辑
    async setDownload() {
      this.onComplute()
      // 如果电子书已经缓存过了
      if (this.isDownload) {
        // 删除被选择的电子书
        this.removeSelectedBook()
      } else {
        // 如果没有缓存过 下载电子书
        await this.downloadSelectedBook()
        // 下载的电子书保存到本地
        saveBookShelf(this.shelfList)
        // 提示缓存成功
        this.simpleToast(this.$t('shelf.setDownloadSuccess'))
      }
    },
    // 私密阅读弹出框
    showPrivate() {
      this.popupMenu = this.popup({
        title: this.isPrivate
          ? this.$t('shelf.closePrivateTitle')
          : this.$t('shelf.setPrivateTitle'),
        btns: [
          {
            text: this.isPrivate
              ? this.$t('shelf.close')
              : this.$t('shelf.open'),
            click: () => {
              // 显示设置私密阅读
              this.setPrivate()
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    // 离线缓存弹出框
    showDownload() {
      this.popupMenu = this.popup({
        title: this.isDownload
          ? this.$t('shelf.removeDownloadTitle')
          : this.$t('shelf.setDownloadTitle'),
        btns: [
          {
            text: this.isDownload
              ? this.$t('shelf.delete')
              : this.$t('shelf.open'),
            click: () => {
              // 显示缓存电子书
              this.setDownload()
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    // 移除被选择的电子书(页面中的 本地缓存还没有被移除)
    removeSelected() {
      this.shelfSelected.forEach(selected => {
        this.setShelfList(this.shelfList.filter(book => book !== selected))
        this.setShelfSelected([])
        this.onComplute()
      })
    },
    // 显示移除被选择的电子书对话框
    showRemove() {
      let title
      if (this.shelfSelected.length === 1) {
        title = this.$t('shelf.removeBookTitle').replace(
          '$1',
          `《${this.shelfSelected[0].title}》`
        )
      } else {
        title = this.$t('shelf.removeBookTitle').replace(
          '$1',
          this.$t('shelf.selectedBooks')
        )
      }
      this.popupMenu = this.popup({
        title: title,
        btns: [
          {
            text: this.$t('shelf.removeBook'),
            type: 'danger',
            click: () => {
              // 移除被选中的电子书
              this.removeSelected()
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    onTabClick(item) {
      if (!this.isSelected) {
        return false
      }
      switch (item.index) {
        case 1:
          this.showPrivate()
          break
        case 2:
          this.showDownload()
          break
        case 3:
          this.dialog().show()
          break
        case 4:
          this.showRemove()
          break
        default:
          break
      }
    },
    label(item) {
      switch (item.index) {
        case 1:
          return this.isPrivate ? item.label2 : item.label
        case 2:
          return this.isDownload ? item.label2 : item.label
        default:
          return item.label
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.shelf-footer {
  display: flex;
  position: fixed;
  z-index: 120;
  left: 0;
  bottom: 0;
  height: px2rem(48);
  width: 100%;
  background: white;
  box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, 0.1);
  .shelf-footer-tab-wrapper {
    flex: 1;
    width: 25%;
    height: 100%;
    .shelf-tab-wrapper {
      width: 100%;
      height: 100%;
      opacity: 0.5;
      @include columnCenter;
      &.is-selected {
        opacity: 1;
      }
      .tab-icon {
        font-size: px2rem(20);
        color: #666;
      }
      .icon-shelf {
        color: $color-pink;
      }
      .tab-text {
        font-size: px2rem(12);
        margin-top: px2rem(5);
        color: #666;
      }
      .remove-text {
        color: $color-pink;
      }
    }
  }
}
</style>
