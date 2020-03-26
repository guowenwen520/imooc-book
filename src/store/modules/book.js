const book = {
  state: {
    fileName: '',
    menuVisible: false,
    // -1: 不显示; 0:字号设置; 1:设置主体; 2: 读书进度；3：目录条
    settingVisible: -1,
    defaultFontSize: 16,
    currentBook: null,
    defaultFontFamily: 'Default',
    fontFamilyVisible: false,
    defaultTheme: 'Default',
    progress: 0,
    bookAvailable: false,
    section: 4,
    cover: null,
    metadata: null,
    navigation: null,
    offsetY: 0,
    isBookMark: null
  },
  mutations: {
    set_filename: (state, fileName) => {
      state.fileName = fileName
    },
    set_menuVisible: (state, menuVisible) => {
      state.menuVisible = menuVisible
    },
    set_settingVisible: (state, settingVisible) => {
      state.settingVisible = settingVisible
    },
    set_defaultFontSize: (state, defaultFontSize) => {
      state.defaultFontSize = defaultFontSize
    },
    set_currentBook: (state, currentBook) => {
      state.currentBook = currentBook
    },
    set_defaultFontFamily: (state, defaultFontFamily) => {
      state.defaultFontFamily = defaultFontFamily
    },
    set_fontFamilyVisible: (state, fontFamilyVisible) => {
      state.fontFamilyVisible = fontFamilyVisible
    },
    set_defaultTheme: (state, defaultTheme) => {
      state.defaultTheme = defaultTheme
    },
    set_progress: (state, progress) => {
      state.progress = progress
    },
    set_bookAvailable: (state, bookAvailable) => {
      state.bookAvailable = bookAvailable
    },
    set_section: (state, section) => {
      state.section = section
    },
    set_cover: (state, cover) => {
      state.cover = cover
    },
    set_metadata: (state, metadata) => {
      state.metadata = metadata
    },
    set_navigation: (state, navigation) => {
      state.navigation = navigation
    },
    set_offsetY: (state, offsetY) => {
      state.offsetY = offsetY
    },
    set_isBookMark: (state, isBookMark) => {
      state.isBookMark = isBookMark
    }
  }
}
export default book
