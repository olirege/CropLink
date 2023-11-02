import { reactive } from 'vue'
import { defineStore } from 'pinia'
export const useModalStore = defineStore('ModalStore', () => {
    const modals = reactive({
        addad: false,
    })
    return {
        modals, 
   }
})
