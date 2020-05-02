<template>
  <ebook-dialog :title="title" ref="dialog">
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <div v-for="(item, index) in categoryList" :key="index">
        <!--v-for和v-if不可以同时使用 v-for的优先级比v-if高，所以每个v-for中都会带有一个v-if-->
        <div
          class="dialog-list-item"
          :class="{ 'is-add': item.edit ? item.edit === 1 : false }"
          @click="onGroupClick(item)"
          v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit"
        >
          <div class="dialog-list-item-text">{{ item.title }}</div>
          <div
            class="dialog-list-icon-wrapper"
            v-if="shelfCategory.id === item.id"
          >
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-new-group-wrapper" v-else>
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{ $t('shelf.groupName') }}</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <input
            type="text"
            class="dialog-input"
            v-model="newGroupName"
            ref="dialogInput"
          />
          <div
            class="dialog-input-clear-wrapper"
            @click="clear"
            v-show="newGroupName && newGroupName.length > 0"
          >
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <div slot="btn" class="group-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">{{ $t('shelf.cancel') }}</div>
      <div
        class="dialog-btn"
        @click="createNewGroup"
        :class="{ 'is-empty': newGroupName && newGroupName.length === 0 }"
        v-if="ifNewGroup"
      >
        {{ $t('shelf.confirm') }}
      </div>
    </div>
  </ebook-dialog>
</template>

<script>
import EbookDialog from '../Common/Dialog'
import { storeShelfMixin } from '../../utils/mixin'
import { removeAddFromShelf, appendAddToShelf } from '../../utils/store'
import { saveBookShelf } from '../../utils/localStorage'

export default {
  name: 'group-dialog',
  mixins: [storeShelfMixin],
  components: {
    EbookDialog
  },
  props: {
    showNewGroup: {
      type: Boolean,
      default: false
    },
    groupName: String
  },
  computed: {
    defaultCategory() {
      return [
        {
          title: this.$t('shelf.newGroup'),
          edit: 1
        },
        {
          title: this.$t('shelf.groupOut'),
          edit: 2
        }
      ]
    },
    isInGroup() {
      return this.currentType === 2
    },
    category() {
      return this.shelfList.filter(item => item.type === 2)
    },
    categoryList() {
      return [...this.defaultCategory, ...this.category]
    },
    title() {
      return !this.ifNewGroup
        ? this.$t('shelf.moveBook')
        : this.$t('shelf.newGroup')
    }
  },
  data() {
    return {
      ifNewGroup: false,
      newGroupName: ''
    }
  },
  methods: {
    show() {
      this.ifNewGroup = this.showNewGroup
      this.newGroupName = this.groupName
      this.$refs.dialog.show()
    },
    hide() {
      this.$refs.dialog.hide()
      setTimeout(() => {
        // 隐藏修改分组弹出层
        this.ifNewGroup = false
      }, 200)
    },
    onGroupClick(item) {
      // 新建分组
      if (item.edit && item.edit === 1) {
        this.ifNewGroup = true
        // 移出分组
      } else if (item.edit && item.edit === 2) {
        this.moveOutFromGroup(item)
      } else {
        this.moveToGroup(item)
      }
    },
    clear() {
      this.newGroupName = ''
    },
    // 移动电子书到分组中
    moveToGroup(group) {
      // group表示被选中的分组里面的电子书
      this.setShelfList(
        // 对电子书进行筛选
        this.shelfList.filter(book => {
          if (book.itemList) {
            book.itemList = book.itemList.filter(
              subBook => this.shelfSelected.indexOf(subBook) < 0
            )
          }
          return this.shelfSelected.indexOf(book) < 0
        })
      ).then(() => {
        if (group && group.itemList) {
          // shelfSelected中的电子书和分组中的电子书合并
          group.itemList = [...group.itemList, ...this.shelfSelected]
        }
        group.itemList.forEach((item, index) => {
          // 让后续加进来的电子书的id进行重新排序
          item.id = index + 1
        })
        this.simpleToast(
          this.$t('shelf.moveBookInSuccess').replace('$1', group.title)
        )
        this.onComplete()
      })
    },
    // 移出分组
    moveOutFromGroup(item) {
      this.moveOutOfGroup(this.onComplete)
    },
    // 添加新的分组
    createNewGroup() {
      // 如果新分组名不存在或者长度为0 退出程序
      if (!this.newGroupName && this.newGroupName.length === 0) {
        return
      }
      // 让分组名等于当前分组的标题
      if (this.showNewGroup) {
        this.shelfCategory.title = this.newGroupName
        this.onComplete()
      } else {
        const group = {
          // 书架中倒数第二个元素的id + 1 (最后一个元素的id是-1)
          id: this.shelfList[this.shelfList.length - 2].id + 1,
          itemList: [],
          selected: false,
          title: this.newGroupName,
          type: 2
        }
        // 新分组列表
        let list = removeAddFromShelf(this.shelfList)
        list.push(group)
        list = appendAddToShelf(list)
        this.setShelfList(list).then(() => {
          this.moveToGroup(group)
        })
      }
    },
    // 隐藏对话框
    onComplete() {
      saveBookShelf(this.shelfList)
      this.hide()
      this.setIsEditMode(false)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/style/global';

.dialog-list-wrapper {
  width: 100%;
  padding: 0 px2rem(20);
  box-sizing: border-box;
  font-size: px2rem(14);
  @include scroll;
  .dialog-list-item {
    display: flex;
    padding: px2rem(15) 0;
    box-sizing: border-box;
    color: #666;
    &.is-add {
      color: $color-blue;
      &:active {
        color: $color-blue-transparent;
      }
    }
    &:active {
      color: rgba(102, 102, 102, 0.5);
    }
    .dialog-list-item-text {
      flex: 1;
    }
    .dialog-list-icon-wrapper {
      flex: 0 0 px2rem(30);
      color: $color-blue;
      @include right;
    }
  }
}

.dialog-new-group-wrapper {
  width: 100%;
  padding: 0 px2rem(20);
  box-sizing: border-box;
  .dialog-input-title-wrapper {
    font-size: px2rem(10);
    margin-top: px2rem(20);
  }
  .dialog-input-wrapper {
    width: 100%;
    padding: 0 0 px2rem(30) 0;
    box-sizing: border-box;
    .dialog-input-inner-wrapper {
      display: flex;
      width: 100%;
      padding: px2rem(10) 0;
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(14);
      color: #666;
      .dialog-input {
        flex: 1;
        border: none;
        &:focus {
          outline: none;
        }
      }
      .dialog-input-clear-wrapper {
        flex: 0 0 px2rem(30);
        color: #ccc;
        @include center;
        &:active {
          color: #999;
        }
      }
    }
  }
}

.group-dialog-btn-wrapper {
  width: 100%;
  @include center;
}
.dialog-btn {
  flex: 1;
  &.is-empty {
    color: rgba(255, 255, 255, 0.5);
  }
  &:active {
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
