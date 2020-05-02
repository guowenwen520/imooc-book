<template>
  <div class="category-book">
    <title-view
      :label="categoryText(data.category)"
      :btn="$t('home.seeAll')"
      @onClick="showBookCategory"
    ></title-view>
    <div class="category-book-list">
      <div
        class="category-book-item"
        v-for="(item, index) in data.list"
        :key="index"
        @click="showBookDetail(item)"
      >
        <div class="img-wrapper">
          <img :src="item.cover" alt class="img" />
        </div>
        <div class="content-wrapper">
          <div class="title title-small" ref="title">{{ item.title }}</div>
          <div class="num sub-title-tiny" ref="author">{{ item.author }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TitleView from './Title'
import { categoryText, getCategoryName } from '../../utils/store'
import { storeHomeMixin } from '../../utils/mixin'
export default {
  mixins: [storeHomeMixin],
  props: {
    data: Object
  },
  components: {
    TitleView
  },
  methods: {
    categoryText(category) {
      return categoryText(category, this)
    },
    showBookCategory() {
      this.$router.push({
        path: '/store/list',
        query: {
          category: getCategoryName(this.data.category),
          categoryText: this.categoryText(this.data.category)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.category-book {
  width: 100%;
  padding: 0 px2rem(5);
  box-sizing: border-box;
  .category-book-list {
    display: flex;
    justify-content: space-evenly;
    .category-book-item {
      display: flex;
      flex: 0 0 25%;
      width: 25%;
      flex-direction: column;
      padding: 0 px2rem(5);
      box-sizing: border-box;
      .img-wrapper {
        .img {
          width: 100%;
        }
      }
      .content-wrapper {
        width: 100%;
        margin-top: px2rem(10);
        .num {
          margin-top: px2rem(5);
        }
      }
    }
  }
}
</style>
