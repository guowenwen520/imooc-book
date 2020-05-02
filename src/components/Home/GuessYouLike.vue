<template>
  <div class="guess-you-like">
    <title-view
      :label="$t('home.guessYouLike')"
      :btn="$t('home.change')"
      @onClick="change"
    ></title-view>
    <div class="guess-you-like-list">
      <div
        class="guess-you-like-item"
        v-for="(item, index) in showData"
        :key="index"
        @click="showBookDetail(item)"
      >
        <div class="item-img-wrapper">
          <img :src="item.cover" alt class="img" />
        </div>
        <div class="item-content-wrapper">
          <div class="title title-big" ref="title">{{ item.title }}</div>
          <div class="author sub-title" ref="author">{{ item.author }}</div>
          <div class="result third-title" ref="result">{{resultText(item)}}</div>
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
  components: {
    TitleView
  },
  data() {
    return {
      total: 0,
      index: 0
    }
  },
  props: {
    data: Array
  },
  watch: {
    data(v) {
      // v的长度是9 total等于3
      this.total = v.length / 3
    }
  },
  methods: {
    change() {
      // 这个算法规定index最大值为2 如果大于2会出错
      if (this.index + 1 >= this.total) {
        this.index = 0
      } else {
        this.index++
      }
    },
    resultText(item) {
      if (item && item.type && item.result) {
        switch (item.type) {
          case 1:
            return this.$t('home.sameAuthor').replace('$1', item.result)
          case 2:
            return this.$t('home.sameReader').replace('$1', item.result)
          case 3:
            return this.$t('home.readPercent').replace('$2', item.result).replace('$1', item.percent)
        }
      }
    }
  },
  computed: {
    showData() {
      if (this.data) {
        return [
          this.data[this.index],
          this.data[this.index + this.total],
          this.data[this.index + this.total * 2]
        ]
      } else {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.guess-you-like {
  .guess-you-like-list {
    width: 100%;
    padding: 0 px2rem(10);
    box-sizing: border-box;
    .guess-you-like-item {
      display: flex;
      margin-top: px2rem(15);
      .item-img-wrapper {
        flex: 0 0 20%;
        padding: px2rem(10) px2rem(10) px2rem(10) 0;
        box-sizing: border-box;
        .img {
          width: 100%;
        }
      }
      .item-content-wrapper {
        flex: 1;
        padding: px2rem(10) 0;
        box-sizing: border-box;
        .author {
          margin-top: px2rem(15);
        }
        .result {
          margin-top: px2rem(5);
        }
      }
    }
  }
}
</style>
