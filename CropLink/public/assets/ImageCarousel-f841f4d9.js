import{e as r,f as t,g as n,d as m,h as v,F as _,k as h,a0 as k,$ as o,l,x as c,_ as p}from"./index-f1a4bff5.js";function f(s,a){return r(),t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[n("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M15.75 19.5L8.25 12l7.5-7.5"})])}function x(s,a){return r(),t("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[n("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M8.25 4.5l7.5 7.5-7.5 7.5"})])}const w={class:"carousel"},y=["src"],C=m({__name:"ImageCarousel",props:{images:{type:Array,required:!0}},setup(s){const a=s,e=v(0),u=()=>{e.value<a.images.length-1?e.value++:e.value=0},i=()=>{e.value>0?e.value--:e.value=a.images.length-1};return(B,I)=>(r(),t("div",w,[n("div",{class:"carousel-inner",style:k({transform:`translateX(-${e.value*100}%)`})},[(r(!0),t(_,null,h(s.images,(d,g)=>(r(),t("div",{class:"carousel-item",key:g},[n("img",{src:d,class:"w-full h-48 object-cover rounded-lg"},null,8,y)]))),128))],4),s.images.length>1?(r(),o(l(f),{key:0,onClick:i,class:"carousel-prev"})):c("",!0),s.images.length>1?(r(),o(l(x),{key:1,onClick:u,class:"carousel-next"})):c("",!0)]))}});const j=p(C,[["__scopeId","data-v-5b941c3b"]]);export{j as I};