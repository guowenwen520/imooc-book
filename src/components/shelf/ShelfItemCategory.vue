<template>
  <div class="shelf-item-category">
    <div class="shelf-item-category-list" v-if="data.itemList.length > 0">
      <div
        class="shelf-item-categoty-list-item"
        v-for="(item, index) in data.itemList"
        :key="index"
      >
        <img :src="item.cover" class="shelf-item-category-img" />
      </div>
    </div>
    <div class="shelf-item-category-bg" v-else>
      <span class="icon-book2"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: Object
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
.shelf-item-category {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .shelf-item-category-list {
    display: flex;
    width: 100%;
    height: 100%;
    flex-flow: row wrap;
    align-content: flex-start;
    padding-top: px2rem(5);
    box-sizing: border-box;
    .shelf-item-categoty-list-item {
      flex: 0 0 33.33%;
      width: 33.33%;
      height: 33.33%;
      box-sizing: border-box;
      &:nth-child(3n+1) {
        padding: 0 px2rem(2.5) px2rem(5) px2rem(5);
      }
      &:nth-child(3n+2) {
        padding: 0 px2rem(2.5) px2rem(5) px2rem(2.5);
      }
      &:nth-child(3n+3) {
        padding: 0 px2rem(5) px2rem(5) px2rem(2.5);
      }
      .shelf-item-category-img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .shelf-item-category-bg {
    width: 100%;
    height: 100%;
    background: white;
    color: #ccc;
    @include center;
  }
}
</style>
