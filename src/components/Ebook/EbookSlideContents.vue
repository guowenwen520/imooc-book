<template>
  <div class="ebook-slide-contents">
    <!--搜索区域-->
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input
          class="slide-contents-search-input"
          type="text"
          :placeholder="$t('book.searchHint')"
          v-model="searchText"
          @click="showSearchPage"
          @keyup.enter.exact="search()"
        />
      </div>
      <div
        class="slide-contents-search-cancel"
        v-if="searchVisible"
        @click="hideSearchPage()"
      >{{ $t('book.cancel') }}</div>
    </div>
    <!--book信息区域-->
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" class="slide-contents-book-img" />
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">
            {{
            metadata.title
            }}
          </span>
        </div>
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">
            {{
            metadata.creator
            }}
          </span>
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{ progress + '%' }}</span>
          <span class="progress-text">{{ $t('book.haveRead2') }}</span>
        </div>
        <div class="slide-contents-book-time">{{ getReadTimeText() }}</div>
      </div>
    </div>
    <!--目录滚动条区域-->
    <scroll class="slide-contents-list" :top="156" :bottom="48" v-show="!searchVisible">
      <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
        <span
          class="slide-contents-item-label"
          :style="contentItemStyle(item)"
          :class="{ selected: section === index }"
          @click="displayContent(item.href)"
        >{{ item.label }}</span>
        <span class="slide-contents-item-page"></span>
      </div>
    </scroll>
    <!--搜索结果区域-->
    <scroll class="slide-search-list" :top="66" :bottom="48" v-show="searchVisible">
      <div
        class="slide-search-item"
        v-for="(item, index) in searchList"
        :key="index"
        @click="displayContent(item.cfi, true)"
      >
        <span v-html="item.excerpt"></span>
      </div>
    </scroll>
  </div>
</template>
<script>
import { ebookMixin } from '../../utils/mixin'
import Scroll from '../Common/Scroll'
import { px2rem } from '../../utils/util'
export default {
  mixins: [ebookMixin],
  data() {
    return {
      searchVisible: false,
      searchList: null,
      searchText: ''
    }
  },
  components: {
    Scroll
  },
  methods: {
    showSearchPage() {
      this.searchVisible = true
    },
    hideSearchPage() {
      this.searchVisible = false
      this.searchList = null
      this.searchText = ''
    },
    contentItemStyle(item) {
      return {
        marginLeft: `${px2rem(item.level) * 15}rem`
      }
    },
    displayContent(target, highlight = false) {
      this.display(target, () => {
        this.hideTitleAndMenu()
        if (highlight) {
          this.currentBook.rendition.annotations.highlight(target)
        }
      })
    },
    // 根据关键字进行全文搜索
    doSearch(q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(section =>
          section
            .load(this.currentBook.load.bind(this.currentBook))
            .then(section.find.bind(section, q))
            .finally(section.unload.bind(section))
        )
        // 数组扁平化
      ).then(results => Promise.resolve([].concat.apply([], results)))
    },
    search() {
      if (this.searchText && this.searchText.trim().length > 0) {
        this.doSearch(this.searchText).then(list => {
          this.searchList = list
          this.searchList.map(item => {
            // 文字高亮显示
            item.excerpt = item.excerpt.replace(
              this.searchText,
              `<span class="content-search-text">${this.searchText}</span>`
            )
            return item
          })
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.ebook-slide-contents {
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      display: flex;
      flex: 1;
      .slide-contents-search-icon {
        flex: 0 0 px2rem(32);
        font-size: px2rem(14);
        @include center;
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(30);
        font-size: px2rem(14);
        padding-left: px2rem(6);
        border: none;
        background: transparent;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .slide-contents-book-title {
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include left;
        .slide-contents-book-title-text {
          @include ellipsis2(3);
        }
      }
      .slide-contents-book-author {
        font-size: px2rem(12);
        line-height: px2rem(14);
        margin-top: px2rem(5);
        @include left;
        .slide-contents-book-author-text {
          @include ellipsis2(1);
        }
      }
    }
    .slide-contents-book-progress-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      flex: 0 0 px2rem(70);
      .slide-contents-book-progress {
        .progress {
          font-size: px2rem(12);
        }
        .progress-text {
          font-size: px2rem(14);
        }
      }
      .slide-contents-book-time {
        font-size: px2rem(12);
        margin-top: px2rem(5);
      }
    }
  }
  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        flex: 1;
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include ellipsis;
      }
      .slide-contents-item-page {
        flex: 0 0 px2rem(30);
        font-size: px2rem(10);
        @include right;
      }
    }
  }
  .slide-search-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item {
      padding: px2rem(20) 0;
      box-sizing: border-box;
      font-size: px2rem(14);
      line-height: px2rem(16);
    }
  }
}
</style>
