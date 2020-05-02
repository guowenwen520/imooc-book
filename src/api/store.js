import axios from 'axios'
import { setLocalForage } from '../utils/localForage'
// 下载电子书的api
export function download(book, onSuccess, onError, onProgress) {
  if (!onProgress) {
    onProgress = onError
    onError = null
  }
  return axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,
    method: 'get',
    responseType: 'blob',
    // 下载的时间限制
    timeout: 180 * 1000,
    // 监听下载进度
    onDownloadProgress: progressEvent => {
      if (onProgress) onProgress(progressEvent)
    }
  }).get(`${book.categoryText}/${book.fileName}.epub`)
    .then(res => {
      // 电子书实例对象
      const blob = new Blob([res.data])
      // 将下载的电子书保存到indexDB中去
      setLocalForage(book.fileName, blob, () => {
        if (onSuccess) onSuccess(book)
      }, err => {
        if (onError) onError(err)
      })
    })
}
// 书城首页api
export function home() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}
// 书架api
export function shelf() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}
// 电子书详情页api
export function detail(book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}
// 电子书列表api
export function list() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}
export function flatList() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
  })
}
