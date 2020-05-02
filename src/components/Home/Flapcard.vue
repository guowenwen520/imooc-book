<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <!--翻转卡片区域-->
    <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-show="runFlapCardAnimation">
      <div
        class="flap-card"
        v-for="(item, index) in flapCardList"
        :key="index"
        :style="{zIndex: item.zIndex}"
      >
        <div class="flap-card-circle">
          <div
            class="flap-card-semi-circle flap-card-semi-circle-left"
            :style="semiCircleStyle(item, 'left')"
            ref="left"
          ></div>
          <div
            class="flap-card-semi-circle flap-card-semi-circle-right"
            :style="semiCircleStyle(item, 'right')"
            ref="right"
          ></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div
          class="point"
          v-for="item in pointList"
          :key="item"
          :class="{'animation': runPointAnimation}"
        ></div>
      </div>
    </div>
    <!--弹出推荐书本区域-->
    <div
      class="book-card"
      :class="{'animation': runBookCardAnimation}"
      v-show="runBookCardAnimation"
    >
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data ? data.cover : ''" />
        </div>
        <div class="content-wrapper">
          <div class="content-title">{{data ? data.title : ''}}</div>
          <div class="content-author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="content-category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <!--关闭按钮区域-->
    <div class="close-btn-wrapper" @click="hideFlapCard">
      <div class="icon-close"></div>
    </div>
  </div>
</template>
<script>
import { storeHomeMixin } from '../../utils/mixin'
import { flapCardList, categoryText } from '../../utils/store'
export default {
  mixins: [storeHomeMixin],
  props: {
    data: Object
  },
  data() {
    return {
      flapCardList,
      front: 0,
      back: 1,
      intervalTime: 25,
      // keyframe出场动画
      runFlapCardAnimation: false,
      runPointAnimation: false,
      pointList: null,
      // 控制推荐电子书的显示与隐藏
      runBookCardAnimation: false
    }
  },
  watch: {
    flapCardVisible(v) {
      if (v) {
        this.runAnimation()
      }
    }
  },
  methods: {
    // 控制卡片翻转动画区域的显示与隐藏
    hideFlapCard() {
      this.setFlapCardVisible(false)
      this.stopAnimation()
    },
    // 设置半圆的样式
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
      }
    },
    // 旋转动画的设置
    rotate(index, type) {
      // 通过索引获得对应的css样式
      const item = this.flapCardList[index]
      let dom
      if (type === 'front') {
        // 右面的半圆
        dom = this.$refs.right[index]
      } else {
        // 左面的半圆
        dom = this.$refs.left[index]
      }
      // 改变被选中dom的样式
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
    },
    // 翻转动画实现
    flapCardRotate() {
      // 动态改变翻转角度和背景颜色
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      // 角度大于180deg时逆时针旋转，小于180deg时顺时针旋转
      frontFlapCard.rotateDegree += 10
      frontFlapCard._g -= 5
      backFlapCard.rotateDegree -= 10
      // 角度小于90deg 可以被看见  颜色渐渐变浅
      if (frontFlapCard._g < 90) {
        frontFlapCard._g += 5
      }
      // 只有改变后面半圆的zIndex，半圆转动效果才能显示出来
      if (
        frontFlapCard.rotateDegree === 90 &&
        backFlapCard.rotateDegree === 90
      ) {
        backFlapCard.zIndex += 2
      }
      // 前面卡片的旋转
      this.rotate(this.front, 'front')
      // 背面左侧半圆旋转
      this.rotate(this.back, 'back')
      // 当第一组转动完后 开始下一组的动画
      if (
        frontFlapCard.rotateDegree === 180 &&
        backFlapCard.rotateDegree === 0
      ) {
        this.next()
      }
    },
    next() {
      // 下一轮动画初始化
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree = 0
      backFlapCard.rotateDegree = 0
      frontFlapCard._g = frontFlapCard.g
      backFlapCard._g = backFlapCard.g
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      this.front++
      this.back++
      const len = this.flapCardList.length
      if (this.front >= len) {
        this.front = 0
      }
      if (this.back >= len) {
        this.back = 0
      }
      // 动态设置zIndex
      // 100 -> 96
      // 99 -> 100
      // 98 -> 99
      // 97 -> 98
      // 96 -> 97
      // (0 - 1 + 5) % 5 = 4
      // (1 - 1 + 5) % 5 = 0
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len)
      })
      this.prepare()
    },
    prepare() {
      const backFlapCard = this.flapCardList[this.back]
      // 让背面左侧半圆刚开始的转动角度为180deg 让左侧半圆和右侧半圆处于重叠状态，左侧半圆和右侧半圆一块转动，但是因为设置了backface-visibility，所以只有左侧半圆转动到90deg改变了zIndex才看得见
      backFlapCard.rotateDegree = 180
      // 初始状态颜色比较深
      backFlapCard._g = backFlapCard._g - 5 * 9
      this.rotate(this.back, 'back')
    },
    startPointAnimation() {
      this.runPointAnimation = true
      setTimeout(() => {
        // 烟花动画持续750ms 750ms后停止烟花动画
        this.runPointAnimation = false
      }, 750)
    },
    startFlapCardAnimation() {
      this.prepare()
      // 利用定时器实现动画效果
      this.task = setInterval(() => {
        this.flapCardRotate()
      }, this.intervalTime)
    },
    reset() {
      // 停止动画的时候重置到初始状态 下一次打开从头开始翻转卡片
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index
        item._g = item.g
        item.rotateDegree = 0
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
      // 将控制动画播放的标志位重置
      this.runFlapCardAnimation = false
      this.runBookCardAnimation = false
      this.runPointAnimation = false
    },
    stopAnimation() {
      // 关闭动画的时候清除定时器
      if (this.task) {
        clearInterval(this.task)
      }
      if (this.timeOut) {
        clearTimeout(this.timeOut)
      }
      if (this.timeOut2) {
        clearTimeout(this.timeOut2)
      }
      // 重置动画相关设置
      this.reset()
    },
    runAnimation() {
      // 开始卡片翻转动画
      this.startFlapCardAnimation()
      this.timeOut = setTimeout(() => {
        // 延迟300ms开始keyframe出场动画
        this.runFlapCardAnimation = true
        // 开始烟花动画
        this.startPointAnimation()
      }, 300)
      this.timeOut2 = setTimeout(() => {
        // 停止动画
        this.stopAnimation()
        this.runBookCardAnimation = true
      }, 2500)
    },
    categoryText() {
      if (this.data) {
        categoryText(this.data.category, this)
      }
    }
  },
  created() {
    this.pointList = []
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`${i}`)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/style/global.scss';
@import '../../assets/style/flapCard.scss';
.flap-card-wrapper {
  @include absCenter;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  @include center;
  .flap-card-bg {
    position: relative;
    width: px2rem(64);
    height: px2rem(64);
    border-radius: px2rem(5);
    background-color: white;
    transform: scale(0);
    opacity: 0;
    &.animation {
      // 执行完动画后 状态保持在100%
      animation: flap-card-move 0.3s ease-in both;
    }
    @keyframes flap-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flap-card {
      width: px2rem(48);
      height: px2rem(48);
      @include absCenter;
      .flap-card-circle {
        display: flex;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
      }
      .flap-card-semi-circle {
        flex: 0 0 50%;
        width: 50%;
        height: 100%;
        // 转动到背面的时候隐藏
        backface-visibility: hidden;
      }
      .flap-card-semi-circle-left {
        background: no-repeat right center;
        border-radius: px2rem(24) 0 0 px2rem(24);
        transform-origin: right;
      }
      .flap-card-semi-circle-right {
        background: no-repeat left center;
        border-radius: 0 px2rem(24) px2rem(24) 0;
        transform-origin: left;
      }
    }
    .point-wrapper {
      z-index: 1500;
      @include absCenter;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation {
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  .book-card {
    position: relative;
    width: 65%;
    max-width: px2rem(400);
    box-sizing: border-box;
    border-radius: px2rem(15);
    background-color: white;
    &.animation {
      animation: scale 0.3s ease-in both;
      @keyframes scale {
        0% {
          scale: 0;
          opacity: 0;
        }
        100% {
          scale: 1;
          opacity: 1;
        }
      }
    }
    .book-card-wrapper {
      width: 100%;
      height: 100%;
      margin-bottom: px2rem(30);
      @include columnTop;
      .img-wrapper {
        width: 100%;
        margin-top: px2rem(20);
        @include center;
        .img {
          width: px2rem(90);
          height: px2rem(130);
        }
      }
      .content-wrapper {
        padding: 0 px2rem(20);
        margin-top: px2rem(20);
        .content-title {
          color: #333;
          font-weight: bold;
          font-size: px2rem(18);
          line-height: px2rem(20);
          max-height: px2rem(40);
          text-align: center;
          @include ellipsis2(2);
        }
        .content-author {
          margin-top: px2rem(10);
          text-align: center;
        }
        .content-category {
          color: #999;
          font-size: px2rem(14);
          margin-top: px2rem(10);
          text-align: center;
        }
      }
      .read-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1100;
        width: 100%;
        border-radius: 0 0 px2rem(15) px2rem(15);
        padding: px2rem(15) 0;
        text-align: center;
        color: white;
        font-size: px2rem(14);
        background: $color-blue;
      }
    }
  }
  .close-btn-wrapper {
    position: absolute;
    left: 0;
    bottom: px2rem(30);
    z-index: 1100;
    width: 100%;
    @include center;
    .icon-close {
      width: px2rem(45);
      height: px2rem(45);
      border-radius: 50%;
      background: #333;
      font-size: px2rem(25);
      color: white;
      @include center;
    }
  }
}
</style>
