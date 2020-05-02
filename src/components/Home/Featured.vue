<template>
  <div class="featured">
    <title-view
      :label="titleText"
      :btn="btnText"
      v-if="titleVisible && data && data.length > 0"
      @click="showBookDetail"
    ></title-view>
    <div class="featured-list">
      <div
        class="featured-list-item"
        v-for="(item, index) in data"
        :key="index"
        @click="showBookDetail(item)"
      >
        <div class="item-img-wrapper">
          <img :src="item.cover" class="img" />
        </div>
        <div class="content-wrapper">
          <div class="title title-small" ref="title">{{ item.title }}</div>
          <div class="author sub-title-tiny" ref="author">
            {{ item.author }}
          </div>
          <div class="category third-title-tiny" ref="category">
            {{ categoryText(item.category) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TitleView from './Title'
import { categoryText } from '../../utils/store'
import { storeHomeMixin } from '../../utils/mixin'
export default {
  mixins: [storeHomeMixin],
  components: {
    TitleView
  },
  props: {
    data: Array,
    titleVisible: {
      type: Boolean,
      default: true
    },
    titleText: {
      type: String
    },
    btnText: {
      type: String
    }
  },
  methods: {
    categoryText(category) {
      return categoryText(category, this)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.featured {
  .featured-list {
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    padding: 0 px2rem(10);
    box-sizing: border-box;
    .featured-list-item {
      display: flex;
      flex: 0 0 50%;
      width: 50%;
      padding: px2rem(5) 0;
      .item-img-wrapper {
        flex: 0 0 30%;
        width: 30%;
        .img {
          width: 100%;
        }
      }
      .content-wrapper {
        flex: 1;
        padding: 0 px2rem(5);
        box-sizing: border-box;
        .author {
          margin-top: px2rem(15);
        }
        .category {
          margin-top: px2rem(5);
        }
      }
    }
  }
}
</style>
