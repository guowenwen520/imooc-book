const store = {
  state: {
    hotSearchOffsetY: 0,
    flapCardVisible: false,
    // 是否进入编辑模式
    isEditMode: false,
    // 书架里选择的书本
    shelfSelected: [],
    // 书架标题的显示与隐藏
    shelfTitleVisible: true,
    // 书架电子书列表
    shelfList: null,
    // 书架分类列表
    shelfCategory: null,
    // 书架列表为1 书架分类列表为2
    currentType: 1
  },
  mutations: {
    set_hotSearchOffsetY: (state, hotSearchOffsetY) => {
      state.hotSearchOffsetY = hotSearchOffsetY
    },
    set_flapCardVisible: (state, flapCardVisible) => {
      state.flapCardVisible = flapCardVisible
    },
    set_isEditMode: (state, isEditMode) => {
      state.isEditMode = isEditMode
    },
    set_shelfSelected: (state, shelfSelected) => {
      state.shelfSelected = shelfSelected
    },
    set_shelfTitleVisible: (state, shelfTitleVisible) => {
      state.shelfTitleVisible = shelfTitleVisible
    },
    set_shelfList: (state, shelfList) => {
      state.shelfList = shelfList
    },
    set_shelfCategory: (state, shelfCategory) => {
      state.shelfCategory = shelfCategory
    },
    set_currentType: (state, currentType) => {
      state.currentType = currentType
    }
  }
}
export default store
