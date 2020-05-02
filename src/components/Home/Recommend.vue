<template>
  <div class="recommend">
    <title-view :label="$t('home.recommend')" :btn="$t('home.seeAll')"></title-view>
    <div class="recommend-list">
      <div
        class="recommend-list-item"
        v-for="(item, index) in data"
        :key="index"
        @click="showBookDetail(item)"
      >
        <div class="item-img-wrapper">
          <img :src="item.cover" alt class="img" />
        </div>
        <div class="content-wrapper">
          <div class="title title-medium" ref="title">{{item.title}}</div>
          <div class="num sub-title" ref="num">{{$t('home.readers').replace('$1', item.readers)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TitleView from './Title'
import { storeHomeMixin } from '../../utils/mixin'
export default {
  mixins: [storeHomeMixin],
  props: {
    data: Array
  },
  components: {
    TitleView
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.recommend {
  .recommend-list {
    display: flex;
    width: 100%;
    @include top;
    padding: 0 px2rem(10);
    box-sizing: border-box;
    .recommend-list-item {
      display: flex;
      flex-direction: column;
      flex: 0 0 33.3%;
      padding: 0 px2rem(5);
      box-sizing: border-box;
      .item-img-wrapper {
        @include center;
        .img {
          width: 80%;
        }
      }
      .content-wrapper {
        width: center;
        margin-top: px2rem(10);
        @include columnCenter;
        .title {
          text-align: center;
        }
        .num {
          margin-top: px2rem(5);
        }
      }
    }
  }
}
</style>
