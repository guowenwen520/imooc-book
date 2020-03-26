const actions = {
  setFileName: ({ commit }, fileName) => {
    return commit('set_filename', fileName)
  },
  setMenuVisible: ({ commit }, menuVisible) => {
    return commit('set_menuVisible', menuVisible)
  },
  setSettingVisible: ({ commit }, settingVisible) => {
    return commit('set_settingVisible', settingVisible)
  },
  setDefaultFontSize: ({ commit }, defaultFontSize) => {
    return commit('set_defaultFontSize', defaultFontSize)
  },
  setCurrentBook: ({ commit }, currentBook) => {
    return commit('set_currentBook', currentBook)
  },
  setDefaultFontFamily: ({ commit }, defaultFontFamily) => {
    return commit('set_defaultFontFamily', defaultFontFamily)
  },
  setFontFamilyVisible: ({ commit }, fontFamilyVisible) => {
    return commit('set_fontFamilyVisible', fontFamilyVisible)
  },
  setDefaultTheme: ({ commit }, defaultTheme) => {
    return commit('set_defaultTheme', defaultTheme)
  },
  setProgress: ({ commit }, progress) => {
    return commit('set_progress', progress)
  },
  setBookAvailable: ({ commit }, bookAvailable) => {
    return commit('set_bookAvailable', bookAvailable)
  },
  setSection: ({ commit }, section) => {
    return commit('set_section', section)
  },
  setCover: ({ commit }, cover) => {
    return commit('set_cover', cover)
  },
  setMetadata: ({ commit }, metadata) => {
    return commit('set_metadata', metadata)
  },
  setNavigation: ({ commit }, navigation) => {
    return commit('set_navigation', navigation)
  },
  setOffsetY: ({ commit }, offsetY) => {
    return commit('set_offsetY', offsetY)
  },
  setIsBookMark: ({ commit }, isBookMark) => {
    return commit('set_isBookMark', isBookMark)
  }
}
export default actions
