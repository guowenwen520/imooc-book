import CreateApi from 'vue-create-api'
import Vue from 'vue'
import Toast from '../components/Common/Toast.vue'
import Popup from '../components/Common/Popup.vue'
import GroupDialog from '../components/shelf/ShelfGroupDialog.vue'
Vue.use(CreateApi)
// 这个createAPI方法会扩展出一个create+组件名称的方法 如createToast
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
Vue.createAPI(GroupDialog, true)
Vue.mixin({
  methods: {
    toast(settings) {
      return this.$createToast({
        $props: settings
      })
    },
    popup(settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    simpleToast(text) {
      const toast = this.toast({
        text: text
      })
      toast.show()
      toast.updateText(text)
    },
    dialog(settings) {
      return this.$createGroupDialog({
        $props: settings
      })
    }
  }
})
