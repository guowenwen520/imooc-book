/* eslint-disable no-extend-native */
Array.prototype.pushWithoutDuplicate = function () {
  for (let i = 0; i < arguments.length; i++) {
    const arg = arguments[i]
    // shelfSelected调用的pushWithoutDuplicate方法，所以this指向的是shelfSelected数组
    if (this.indexOf(arg) === -1) {
      this.push(arg)
    }
  }
}
