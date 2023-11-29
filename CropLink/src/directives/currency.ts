import type { DirectiveBinding } from 'vue';
export default {
    beforeMount: function(el: HTMLElement, binding: DirectiveBinding) {
        let val: string | number = 0
        if(binding.value === undefined) {
            val = 0
        } else {
            val = binding.value
        }
        el.innerHTML = val.toLocaleString('en-US', { style: 'currency', currency: 'CAD' });
    },
    updated: function(el: HTMLElement, binding: DirectiveBinding) {
        let val: string | number = 0
        if(binding.value === undefined) {
            val = 0
        } 
        else {
            val = binding.value
        }
        el.innerHTML = val.toLocaleString('en-US', { style: 'currency', currency: 'CAD' });
    }
};