import{d as f,u as y,s as T,a as h,h as p,o as k,m as v,n as C,e as n,f as a,l as _,g as s,p as u,q as L,x as r,F as l,k as w,L as E,i as o,t}from"./index-f1a4bff5.js";import{I as R}from"./ImageCarousel-f841f4d9.js";const N={key:0},P={class:"p-4"},S={key:1},V={class:"w-full h-48 object-cover rounded-lg"},D={class:"text-xl font-semibold mb-2"},Y={class:"text-sm mb-2"},B=s("strong",null,"Id:",-1),I={class:"text-sm mb-2"},q=s("strong",null,"Variety:",-1),F={class:"text-sm mb-2"},O=s("strong",null,"Yield Tonnage:",-1),U={class:"text-sm mb-2"},H=s("strong",null,"Expected Harvest Date:",-1),M={class:"text-sm mb-2"},j=s("strong",null,"Price:",-1),G={class:"text-xl font-semibold mb-2"},W={class:"text-sm mb-2"},z=s("strong",null,"Id:",-1),J={class:"text-sm mb-2"},K=s("strong",null,"Yield Tonnage:",-1),Q={class:"text-sm mb-2"},X=s("strong",null,"Request Date:",-1),Z={class:"text-sm mb-2"},$=s("strong",null,"Price:",-1),A={key:2},ns=f({__name:"FeedView",setup(ss){y();const{profile:g}=T(h()),m=h().ACCOUNT_TYPES,i=p([]),c=p(!1);return k(async()=>{c.value=!0;const d=await v("ads","live","==",!0,"postedOn",25);console.log("ads",d),i.value=d.docs,c.value=!1}),(d,es)=>{const x=C("RouterLink");return n(),a(l,null,[_(g)?(n(),a("div",N,[s("div",P,[u(x,{class:"hover:underline",to:"/userboard"},{default:L(()=>[o("Post an ad")]),_:1})])])):r("",!0),i.value.length>0&&!c.value?(n(),a("div",S,[(n(!0),a(l,null,w(i.value,(e,b)=>(n(),a("div",{key:b,class:"bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"},[e.adType==_(m).SELLER?(n(),a(l,{key:0},[s("div",V,[u(R,{images:e.images},null,8,["images"])]),s("h3",D,t(e.type),1),s("p",Y,[B,o(" "+t(e.id),1)]),s("p",I,[q,o(" "+t(e.variety),1)]),s("p",F,[O,o(" "+t(e.yieldTonnage),1)]),s("p",U,[H,o(" "+t(e.expectedHarvestDate),1)]),s("p",M,[j,o(" "+t(e.price),1)])],64)):r("",!0),e.adType==_(m).BUYER?(n(),a(l,{key:1},[s("h3",G,t(e.type),1),s("p",W,[z,o(" "+t(e.id),1)]),s("p",J,[K,o(" "+t(e.yieldTonnage),1)]),s("p",Q,[X,o(" "+t(e.requestDate),1)]),s("p",Z,[$,o(" "+t(e.price),1)])],64)):r("",!0)]))),128))])):r("",!0),c.value?(n(),a("div",A,[u(E,{isLoading:c.value},null,8,["isLoading"])])):r("",!0)],64)}}});export{ns as default};