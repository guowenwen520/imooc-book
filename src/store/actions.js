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
  },
  setHotSearchOffsetY: ({ commit }, hotSearchOffsetY) => {
    return commit('set_hotSearchOffsetY', hotSearchOffsetY)
  },
  setFlapCardVisible: ({ commit }, flapCardVisible) => {
    return commit('set_flapCardVisible', flapCardVisible)
  },
  setIsEditMode: ({ commit }, isEditMode) => {
    return commit('set_isEditMode', isEditMode)
  },
  setShelfSelected: ({ commit }, shelfSelected) => {
    return commit('set_shelfSelected', shelfSelected)
  },
  setShelfTitleVisible: ({ commit }, shelfTitleVisible) => {
    return commit('set_shelfTitleVisible', shelfTitleVisible)
  },
  setShelfList: ({ commit }, shelfList) => {
    return commit('set_shelfList', shelfList)
  },
  setShelfCategory: ({ commit }, shelfCategory) => {
    return commit('set_shelfCategory', shelfCategory)
  },
  setCurrentType: ({ commit }, currentType) => {
    return commit('set_currentType', currentType)
  }
}
export default actions
