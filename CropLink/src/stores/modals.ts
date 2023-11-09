import { reactive } from 'vue'
import { defineStore } from 'pinia'
export const useModalStore = defineStore('ModalStore', () => {
    const modals = reactive({
        addad: false,
        addbid: false,
        editad: false,
        context: {},
    })
    const NOTIFICATION_TYPES = {
        SUCCESS: "success",
        ERROR: "error",
        INFO: "info",
        WARNING: "warning",
    }
    const notifications = reactive({
        show: false,
        message: "",
        type: "",
        context: {},
    })
    const dropdowns = reactive({
        show: false,
        message: "",
        type: "",
        context: {},
    })
    const resetNotification = () => {
        notifications.show = false
        notifications.message = ""
        notifications.type = ""
        notifications.context = {}
    }
    const resetModals = () => {
        modals.addad = false
        modals.addbid = false
        modals.editad = false
        modals.context = {}
    }
    const resetDropdowns = () => {
        dropdowns.show = false
        dropdowns.message = ""
        dropdowns.type = ""
        dropdowns.context = {}
    }
    return {
        modals,
        notifications,
        dropdowns,
        NOTIFICATION_TYPES,
        resetNotification,
        resetModals,
        resetDropdowns,
   }
})
