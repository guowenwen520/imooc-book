<template>
  <div class="category">
    <title-view
      :label="$t('home.category')"
      :btn="$t('home.seeAll')"
      @onClick="showBookList"
    ></title-view>
    <div class="category-list">
      <div
        class="category-item-wrapper"
        v-for="(item, index) in data"
        :key="index"
        @click="showBookCategory(item)"
      >
        <div class="category-item">
          <div class="content-wrapper">
            <div class="title title-medium">
              {{ categoryText(item.category) }}
            </div>
            <div class="num sub-title-tiny">
              {{ item.num + ' ' + $t('home.books') }}
            </div>
          </div>
          <div class="img-wrapper">
            <div class="img-group">
              <img class="img" :src="item.img1" />
              <img class="img2" :src="item.img2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TitleView from './Title'
import { categoryText, getCategoryName } from '../../utils/store'
export default {
  components: {
    TitleView
  },
  props: {
    data: Array
  },
  methods: {
    categoryText(category) {
      return categoryText(category, this)
    },
    // 书本列表
    showBookList() {
      this.$router.push('/store/list')
    },
    showBookCategory(item) {
      this.$router.push({
        path: '/store/list',
        query: {
          category: getCategoryName(item.category),
          categoryText: this.categoryText(item.category)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.category {
  .category-list {
    width: 100%;
    padding: 0 px2rem(10);
    box-sizing: border-box;
    display: flex;
    flex-flow: row wrap;
    .category-item-wrapper {
      flex: 0 0 50%;
      width: 50%;
      padding: 0 px2rem(5) px2rem(10) px2rem(5);
      box-sizing: border-box;
      &:nth-child(odd) {
        padding-left: 0;
      }
      &:nth-child(even) {
        padding-right: 0;
      }
      .category-item {
        display: flex;
        width: 100%;
        background-color: #eee;
        .content-wrapper {
          flex: 0 0 50%;
          width: 50%;
          @include columnCenter;
          .title {
            width: 100%;
            white-space: normal;
            text-align: center;
          }
          .num {
            text-align: center;
            margin-top: px2rem(5);
          }
        }
        .img-wrapper {
          flex: 0 0 50%;
          width: 50%;
          padding: px2rem(20) px2rem(10);
          box-sizing: border-box;
          .img-group {
            position: relative;
            width: 100%;
            height: px2rem(60);
            .img {
              position: absolute;
              left: 0;
              top: 0;
              z-index: 100;
              width: px2rem(45);
              height: px2rem(60);
            }
            .img2 {
              position: absolute;
              left: px2rem(30);
              top: px2rem(7.5);
              z-index: 99;
              width: px2rem(30);
              height: px2rem(45);
            }
          }
        }
      }
    }
  }
}
</style>
