import{d as g,a as v,h as i,o as f,H as h,e,f as s,g as p,t as y,F as d,k,l as S,L,y as c,q as u,p as _}from"./index-bd340418.js";import{_ as N}from"./SellerAdCard.vue_vue_type_script_setup_true_lang-39ac11b1.js";import{_ as C}from"./BuyerAdCard.vue_vue_type_script_setup_true_lang-3a3b6389.js";import"./ImageCarousel-df949461.js";const A={class:"font-xl"},E={key:0,class:"grid grid-cols-2"},T={key:1},B=p("p",{class:"text-center"},"No ads to show",-1),x=[B],V={key:2},Y=g({__name:"SellerAdsView",props:{id:{type:String,required:!0},sellerName:{type:String,required:!0}},setup(m){const r=v().ACCOUNT_TYPES,a=i([]),t=i(!1),l=m;return f(async()=>{t.value=!0;const n=await h("ads","live","==",!0,"uid","==",l.id,["postedOn","desc"],25);console.log("ads",n),a.value=n.docs,t.value=!1}),(n,q)=>(e(),s(d,null,[p("h1",A,y(l.sellerName)+"'s ads ",1),a.value.length>0&&!t.value?(e(),s("div",E,[(e(!0),s(d,null,k(a.value,o=>(e(),s("div",null,[o.adType==c(r).SELLER?(e(),u(N,{key:0,ad:o},null,8,["ad"])):_("",!0),o.adType==c(r).BUYER?(e(),u(C,{key:1,ad:o},null,8,["ad"])):_("",!0)]))),256))])):a.value.length==0&&!t.value?(e(),s("div",T,x)):(e(),s("div",V,[S(L,{isLoading:t.value},null,8,["isLoading"])]))],64))}});export{Y as default};