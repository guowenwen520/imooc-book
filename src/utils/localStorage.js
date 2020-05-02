// web-storage-cache可以将存入到localStorage中的数据自动转换成json字符串格式,同时从localStorage获得的数据自动转换为对象形式
import Storage from 'web-storage-cache'

const localStorage = new Storage()
// 自己封装的4中操作localStorage的方法
export function setLocalStorage(key, value) {
  return localStorage.set(key, value)
}

export function getLocalStorage(key) {
  return localStorage.get(key)
}

export function removeLocalStorage(key) {
  return localStorage.delete(key)
}

export function clearLocalStorage() {
  return localStorage.clear()
}
// 保存book对象到localStorage中
export function setBookObject(fileName, key, value) {
  // 先到localStorage中找book
  let book = getLocalStorage(`${fileName}-info`)
  if (!book) {
    book = {}
  }
  book[key] = value
  setLocalStorage(`${fileName}-info`, book)
}
// 获取book对象
export function getBookObject(fileName, key) {
  const book = getLocalStorage(`${fileName}-info`)
  if (book) {
    return book[key]
  } else {
    return null
  }
}
// 获取字体
export function getFontFamily(fileName) {
  return getBookObject(fileName, 'fontFamily')
}
// 保存字体
export function saveFontFamily(fileName, font) {
  return setBookObject(fileName, 'fontFamily', font)
}
// 获取字号大小
export function getFontSize(fileName) {
  return getBookObject(fileName, 'fontSize')
}
// 保存字号大小
export function saveFontSize(fileName, fontSize) {
  return setBookObject(fileName, 'fontSize', fontSize)
}
// get当前的语言标识
export function getLocale() {
  return getLocalStorage('locale')
}
// set当前的语言标识
export function saveLocale(locale) {
  return setLocalStorage('locale', locale)
}
// 获取当前缓存里面的主体
export function getTheme(fileName) {
  return getBookObject(fileName, 'theme')
}
// 保存主题到缓存里
export function saveTheme(fileName, theme) {
  return setBookObject(fileName, 'theme', theme)
}
// 获得电子书阅读位置信息
export function getLocation(fileName) {
  return getBookObject(fileName, 'location')
}
// 保存电子书阅读位置信息
export function saveLocation(fileName, location) {
  return setBookObject(fileName, 'location', location)
}
// 获取读书时间
export function getReadTime(fileName) {
  return getBookObject(fileName, 'readTime')
}
// 保存读书时间
export function saveReadTime(fileName, readTime) {
  return setBookObject(fileName, 'readTime', readTime)
}
// 获取当前电子书封面链接
export function getCover(fileName) {
  return getBookObject(fileName, 'cover')
}
// 保存当前电子书的封面到缓存
export function saveCover(fileName, cover) {
  return setBookObject(fileName, 'cover', cover)
}
// 获得书签
export function getBookMark(fileName) {
  return getBookObject(fileName, 'bookmark')
}
// 保存书签
export function saveBookMark(fileName, bookmark) {
  return setBookObject(fileName, 'bookmark', bookmark)
}
// 获取书架电子书列表
export function getBookShelf(shelf) {
  return getLocalStorage('shelf')
}
// 保存书架电子书列表
export function saveBookShelf(shelf) {
  return setLocalStorage('shelf', shelf)
}
