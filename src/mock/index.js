import Mock from 'mockjs'
// 模拟书架数据
import shelf from './bookShelf'
// 模拟电子书首页数据
import home from './bookHome'
// 模拟电子书列表数据
import bookList from './bookList'
// 模拟查询电子书的数据
import flatList from './bookFlatList'
// 模拟接口传入三个参数 第一个参数表示请求路径、第二个参数表示请求方式、第三个参数表示从何处请求
Mock.mock(/\/book\/home/, 'get', home)
Mock.mock(/\/book\/shelf/, 'get', shelf)
Mock.mock(/\/book\/list/, 'get', bookList)
Mock.mock(/\/book\/flat-list/, 'get', flatList)
