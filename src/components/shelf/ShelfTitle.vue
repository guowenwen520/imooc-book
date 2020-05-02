<template>
  <transition name="fade">
    <div
      class="shelf-title"
      v-show="shelfTitleVisible"
      :class="{ 'hide-shadow': ifHideShadow }"
    >
      <div class="shelf-title-text-wrapper">
        <span class="self-title-text">{{ title }}</span>
        <span class="self-title-sub-text" v-show="isEditMode">
          {{ selectedText }}
        </span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showClear">
        <span clsss="shelf-title-btn-text" @click="clearCache">
          {{ $t('shelf.clearCache') }}
        </span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right" v-if="showEdit">
        <span clsss="shelf-title-btn-text" @click="editClick">
          {{ isEditMode ? $t('shelf.cancel') : $t('shelf.edit') }}
        </span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left" v-if="ShowBack">
        <span class="icon-back" @click="back"></span>
      </div>
      <div
        class="shelf-title-btn-wrapper"
        :class="{
          'shelf-title-left': changeGroupLeft,
          'shelf-title-right': changeGroupRight
        }"
        @click="changeGroup"
        v-if="showChangeGroup"
      >
        <span class="shelf-title-btn-text">{{ $t('shelf.editGroup') }}</span>
      </div>
    </div>
  </transition>
</template>
<script>
import { storeShelfMixin } from '../../utils/mixin'
import { clearLocalStorage, saveBookShelf } from '../../utils/localStorage'
import { clearLocalForage } from '../../utils/localForage'
export default {
  mixins: [storeShelfMixin],
  data() {
    return {
      ifHideShadow: true
    }
  },
  props: {
    title: String
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        // 显示阴影
        this.ifHideShadow = false
      } else {
        this.ifHideShadow = true
      }
    }
  },
  computed: {
    selectedText() {
      // 被选中的电子书的数量
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
      return selectedNumber <= 0
        ? this.$t('shelf.selectBook')
        : selectedNumber === 1
          ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber)
          : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber)
    },
    // 判断分类列表是否为空
    emptyCategory() {
      return (
        !this.shelfCategory ||
        !this.shelfCategory.itemList ||
        this.shelfCategory.itemList.length === 0
      )
    },
    // 是否显示编辑按钮
    showEdit() {
      return this.currentType === 1 || !this.emptyCategory
    },
    // 是否后退
    ShowBack() {
      return this.currentType === 2 && !this.isEditMode
    },
    // 是否显示修改分组
    showChangeGroup() {
      return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
    },
    // 是否显示清除缓存
    showClear() {
      return this.currentType === 1
    },
    changeGroupLeft() {
      return !this.emptyCategory
    },
    changeGroupRight() {
      return this.emptyCategory
    },
    popupCancelBtn() {
      return this.createPopupBtn(this.$t('shelf.cancel'), () => {
        this.hidePopup()
      })
    }
  },
  methods: {
    onComplete() {
      this.hidePopup()
      this.setShelfList(
        this.shelfList.filter(book => book.id !== this.shelfCategory.id)
      ).then(() => {
        saveBookShelf(this.shelfList)
        this.$router.go(-1)
        this.setIsEditMode(false)
      })
    },
    deleteGroup() {
      if (!this.emptyCategory) {
        this.setShelfSelected(this.shelfCategory.itemList)
        this.moveOutOfGroup(this.onComplete)
      } else {
        this.onComplete()
      }
    },
    // 弹出层的按钮
    createPopupBtn(text, onClick, type = 'normal') {
      return {
        text: text,
        type: type,
        click: onClick
      }
    },
    // 修改分组
    changeGroup() {
      this.popupMenu = this.popup({
        btns: [
          this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
            this.changeGroupName()
          }),
          this.createPopupBtn(
            this.$t('shelf.deleteGroup'),
            () => {
              this.showDeleteGroup()
            },
            'danger'
          ),
          this.popupCancelBtn
        ]
      }).show()
    },
    // 修改分组名称
    changeGroupName() {
      this.hidePopup()
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title
      }).show()
    },
    // 删除分组
    showDeleteGroup() {
      this.hidePopup()
      setTimeout(() => {
        this.popupMenu = this.popup({
          title: this.$t('shelf.deleteGroupTitle'),
          btns: [
            this.createPopupBtn(
              this.$t('shelf.confirm'),
              () => {
                this.deleteGroup()
              },
              'danger'
            ),
            this.popupCancelBtn
          ]
        }).show()
      }, 200)
    },
    // 隐藏弹出层
    hidePopup() {
      this.popupMenu.hide()
    },
    // 后退
    back() {
      this.$router.go(-1)
      this.setIsEditMode(false)
    },
    // 编辑状态切换
    editClick() {
      if (!this.isEditMode) {
        // 取消编辑时，清空被选中的电子书
        this.setShelfSelected([])
        this.shelfList.forEach(item => {
          // 重置选中状态
          item.selected = false
          // 取消分类图书列表的选中状态
          if (item.itemList) {
            item.itemList.forEach(subItem => {
              subItem.selected = false
            })
          }
        })
      }
      this.setIsEditMode(!this.isEditMode)
    },
    // 清除缓存
    clearCache() {
      clearLocalStorage()
      clearLocalForage()
      // 重置vuex的电子书列表
      this.setShelfList([])
      // 重置被选择的电子书
      this.setShelfSelected([])
      this.getShelfList()
      this.simpleToast(this.$t('shelf.clearCacheSuccess'))
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.shelf-title {
  position: relative;
  width: 100%;
  z-index: 200;
  height: px2rem(42);
  background-color: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-title-text-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    @include columnCenter;
    .self-title-text {
      font-size: px2rem(16);
      font-weight: bold;
      line-height: px2rem(20);
      color: #333;
    }
    .self-title-sub-text {
      font-size: px2rem(10);
      color: #333;
    }
  }
  .shelf-title-btn-wrapper {
    position: absolute;
    top: 0;
    height: px2rem(42);
    @include center;
    .shelf-title-btn-text {
      font-size: px2rem(14);
      color: #666;
    }
    &.shelf-title-left {
      font-size: px2rem(14);
      padding-left: px2rem(15);
      left: 0;
    }
    &.shelf-title-right {
      font-size: px2rem(14);
      padding-right: px2rem(20);
      right: 0;
    }
    &.icon-back {
      padding-left: px2rem(20);
      font-size: px2rem(20);
      color: #666;
    }
    &.shelf-title-left {
      left: 0;
      padding-left: px2rem(15);
    }
    &.shelf-title-right {
      right: 0;
      padding-right: px2rem(15);
    }
  }
}
</style>
