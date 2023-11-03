import { reactive } from 'vue'
import { defineStore } from 'pinia'
export const useModalStore = defineStore('ModalStore', () => {
    const modals = reactive({
        addad: false,
        addbid: false,
        editad: false,
        context: {},
    })
    return {
        modals, 
   }
})
