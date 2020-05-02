<template>
  <div class="store-home">
    <search-bar></search-bar>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
    <div class="banner-wrapper">
      <div>
        <img :src="banner" class="banner-img">
      </div>
    </div>
    <guess-you-like :data="guessYouLike"></guess-you-like>
    <recommend :data="recommend" class="recommend"></recommend>
    <featured :data="featured" class="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')"></featured>
    <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
      <category-book :data="item"></category-book>
    </div>
    <category :data="categories" class="categories"></category>
    </scroll>
    <flap-card :data="random"></flap-card>
  </div>
</template>
<script>
import SearchBar from '../../components/Home/SearchBar.vue'
import Scroll from '../../components/Common/Scroll'
import FlapCard from '../../components/Home/Flapcard'
import GuessYouLike from '../../components/Home/GuessYouLike'
import Recommend from '../../components/Home/Recommend'
import Featured from '../../components/Home/Featured'
import CategoryBook from '../../components/Home/CategoryBook'
import Category from '../../components/Home/Category'
import { storeHomeMixin } from '../../utils/mixin'
import { home } from '../../api/store'
export default {
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
    FlapCard,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category
  },
  data() {
    return {
      scrollTop: 94,
      random: null,
      banner: null,
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null
    }
  },
  methods: {
    // 处理滚动事件
    onScroll(offsetY) {
      // 触发滚动事件时，改变vuex中的offsetY
      this.setOffsetY(offsetY)
      if (offsetY > 0) {
        // 隐藏标题栏的时候，改变滚动条top值为52
        this.scrollTop = 52
      } else if (offsetY === 0) {
        // 显示标题栏时，滚动条top值为94
        this.scrollTop = 94
      }
      // 刷新滚动条
      this.$refs.scroll.refresh()
    }
  },
  mounted() {
    // 处理请求后的数据
    home().then(response => {
      if (response && response.status === 200) {
        const data = response.data
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
        this.banner = data.banner
        // 猜你喜欢
        this.guessYouLike = data.guessYouLike
        // 随机推荐
        this.recommend = data.recommend
        // 精品推荐
        this.featured = data.featured
        // 分类列表
        this.categoryList = data.categoryList
        // 分类图书
        this.categories = data.categories
      }
    })
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.store-home {
  width: 100%;
  height: 100%;
  .banner-wrapper {
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    .banner-img {
      width: 100%;
      height: px2rem(150);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .recommend {
    margin-top: px2rem(20);
  }
  .featured {
    margin-top: px2rem(20);
  }
  .category-list-wrapper {
    margin-top: px2rem(20);
  }
  .categories {
    margin-top: px2rem(20);
  }
}
</style>
