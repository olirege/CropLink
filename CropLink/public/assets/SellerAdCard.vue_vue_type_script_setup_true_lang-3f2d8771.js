import{e as n,f as c,g as t,d as A,h as C,F as j,k as _,aa as V,y as m,l,x as u,_ as N,ab as O,s as R,B as H,a as k,u as M,t as r,i as o,q as b,C as $,p as P,z as T,A as D}from"./index-b2d2f6d8.js";function q(e,g){return n(),c("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M15.75 19.5L8.25 12l7.5-7.5"})])}function z(e,g){return n(),c("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M8.25 4.5l7.5 7.5-7.5 7.5"})])}const F={class:"carousel"},U=["src"],W=A({__name:"ImageCarousel",props:{images:{type:Array,required:!0}},setup(e){const g=e,a=C(0),d=()=>{a.value<g.images.length-1?a.value++:a.value=0},f=()=>{a.value>0?a.value--:a.value=g.images.length-1};return(x,S)=>(n(),c("div",F,[t("div",{class:"carousel-inner",style:V({transform:`translateX(-${a.value*100}%)`})},[(n(!0),c(j,null,_(e.images,(v,y)=>(n(),c("div",{class:"carousel-item",key:y},[v?(n(),c("img",{key:0,src:v,class:"w-full h-48 object-cover rounded-lg"},null,8,U)):u("",!0)]))),128))],4),e.images.length>1?(n(),m(l(q),{key:0,onClick:f,class:"carousel-prev"})):u("",!0),e.images.length>1?(n(),m(l(z),{key:1,onClick:d,class:"carousel-next"})):u("",!0)]))}});const X=N(W,[["__scopeId","data-v-2f5da948"]]),w=A({__name:"CardButton",emits:["click"],setup(e,{emit:g}){return(a,d)=>(n(),c("button",{onClick:d[0]||(d[0]=f=>a.$emit("click")),class:"mt-2 mb-2 w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"},[O(a.$slots,"default")]))}}),Y={class:"bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"},G={class:"w-full h-48 object-cover rounded-lg"},J={class:"text-xl font-semibold mb-2"},K={class:"text-sm mb-2"},Q=t("strong",null,"Status:",-1),Z={class:"text-sm mb-2"},I=t("strong",null,"Id:",-1),p={class:"text-sm mb-2"},ee=t("strong",null,"Variety:",-1),te={class:"text-sm mb-2"},se=t("strong",null,"Yield Tonnage:",-1),ne={class:"text-sm mb-2"},ae=t("strong",null,"Expected Harvest Date:",-1),ie={class:"text-sm mb-2"},oe=t("strong",null,"Price:",-1),le={class:"text-sm mb-2"},de=t("strong",null,"bidding End time:",-1),re={key:0,class:"flex justify-end mt-2 space-x-4"},ce=A({__name:"SellerAdCard",props:{ad:{type:Object,required:!0},showButtons:{type:Boolean,default:!0}},emits:["edit"],setup(e,{emit:g}){const{modals:a}=R(H()),d=k().AD_STATUSES,f=M(),x=C(!1),S=async s=>{s&&(x.value=!0,await k().postNewAd(s),x.value=!1)},v=C(""),y=async s=>{s&&(v.value=s,console.log("removeAd",s),await k().removeUserAd(s),v.value="")},B=s=>{s&&f.push({name:"ad",params:{adId:s}})},E=async s=>{s&&(console.log("removeAd",s),a.value.editad=!0,a.value.context=ads.value.docs.find(i=>i.id===s))},L=s=>{s&&f.push({name:"messaging",params:{adId:s}})};return(s,i)=>(n(),c("div",Y,[t("div",G,[e.ad.images&&e.ad.images.length>0?(n(),m(X,{key:0,images:e.ad.resizedImages},null,8,["images"])):u("",!0)]),t("h3",J,r(e.ad.type),1),t("p",K,[Q,o(" "+r(e.ad.status),1)]),t("p",Z,[I,o(" "+r(e.ad.id),1)]),t("p",p,[ee,o(" "+r(e.ad.variety),1)]),t("p",te,[se,o(" "+r(e.ad.yieldTonnage),1)]),t("p",ne,[ae,o(" "+r(l(T)(e.ad.expectedHarvestDate)?l(D)(e.ad.expectedHarvestDate):e.ad.expectedHarvestDate),1)]),t("p",ie,[oe,o(" "+r(e.ad.price),1)]),t("p",le,[de,o(" "+r(l(T)(e.ad.biddingEndTime)?l(D)(e.ad.biddingEndTime):e.ad.biddingEndTime),1)]),e.showButtons?(n(),c("div",re,[!e.ad.live&&e.ad.status!=l(d).SOLD?(n(),m(w,{key:0,onClick:i[0]||(i[0]=h=>E(e.ad.id))},{default:b(()=>[o(" Edit ")]),_:1})):u("",!0),!e.ad.live&&e.ad.status==l(d).SOLD?(n(),m(w,{key:1,onClick:i[1]||(i[1]=h=>L(e.ad.id))},{default:b(()=>[o(" Contact Winner ")]),_:1})):u("",!0),!e.ad.live&&e.ad.status!=l(d).SOLD?(n(),m($,{key:2,disabled:e.ad.live,isLoading:x.value,onClick:i[2]||(i[2]=h=>S(e.ad.id)),class:"inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"},{default:b(()=>[o(" Post "+r(e.ad.status),1)]),_:1},8,["disabled","isLoading"])):u("",!0),P(w,{onClick:i[3]||(i[3]=h=>B(e.ad.id))},{default:b(()=>[o(" View ")]),_:1}),!e.ad.live&&e.ad.status!=l(d).SOLD?(n(),m($,{key:3,disabled:e.ad.live,isLoading:v.value==e.ad.id,onClick:i[4]||(i[4]=h=>y(e.ad.id)),class:"inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"},{default:b(()=>[o(" Remove ")]),_:1},8,["disabled","isLoading"])):u("",!0)])):u("",!0)]))}});export{ce as _,w as a};
