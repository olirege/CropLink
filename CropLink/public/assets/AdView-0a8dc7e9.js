import{d as R,s as I,x as W,a as f,h as r,o as z,c as H,e as s,f as d,l as L,y as h,q as y,m as B,_ as J,p as i,t as K,F as C,k as j,n as Q,L as X,g as E,I as Z,H as D,z as T,J as A,K as N,M as c,N as S,O as ee,i as $,B as b}from"./index-bd340418.js";import{_ as ae}from"./SellerAdCard.vue_vue_type_script_setup_true_lang-39ac11b1.js";import{_ as te}from"./BidCard.vue_vue_type_script_setup_true_lang-a858b237.js";import"./ImageCarousel-df949461.js";const se={key:0,class:"grid grid-cols-2 gap-x-4 p-5"},oe={key:0},de={key:1},ne={key:2},ie=E("p",null,"No bids yet",-1),le=[ie],ue={key:3},re={key:1},ce=E("p",null,"Ad not live yet",-1),ve={key:1},ge=R({__name:"AdView",props:{adId:{type:String,required:!0}},setup(M){const{modals:P}=I(W()),{profile:x}=I(f()),O=f().ACCOUNT_TYPES,m=f().AD_STATUSES,l=M,o=r([]),e=r({}),u=r(!1);let v;const U=async()=>{u.value=!0,e.value=await Z("ads",l.adId),e.value&&(e.value.live||e.value.status!=m.SOLD?(o.value=await D("bids","adId","==",l.adId,"status","==","pending",["createdAt","desc"],10),v=T(A(S(b,"bids"),c("adId","==",l.adId),c("status","==","pending"),N("createdAt","desc")),t=>{o.value=t.docs.map(a=>({id:a.id,...a.data()}))})):!e.value.live&&e.value.status==m.SOLD?(o.value=await D("bids","adId","==",l.adId,"status","==","accepted",["createdAt","desc"],10),v=T(A(S(b,"bids"),c("adId","==",l.adId),c("status","==","accepted"),N("createdAt","desc")),t=>{o.value=t.docs.map(a=>({id:a.id,...a.data()}))})):v=T(A(S(b,"ads"),c("id","==",l.adId)),t=>{e.value=t.docs.map(a=>(console.log("ad changed",a.data()),{...a.data()}))}),u.value=!1)},_=r(""),k=()=>{if(!e.value.biddingEndTime)return"";const t=ee(e.value.biddingEndTime),a=Date.now(),n=t-a;if(n<0){_.value="Bidding has ended",clearInterval(w);return}let p=Math.floor(n/1e3%60),F=Math.floor(n/(1e3*60)%60),G=Math.floor(n/(1e3*60*60)%24),Y=Math.floor(n/(1e3*60*60*24));_.value=`${Y} days ${G} hours ${F} minutes ${p} seconds`},w=setInterval(k,1e3),V=()=>{P.value.addbid=!0};z(async()=>{await U(),k()}),H(()=>{v(),clearInterval(w)});const g=r(!1),q=async t=>{t&&(g.value=!0,console.log("postAd",t),await f().postNewAd(t),g.value=!1)};return(t,a)=>{var n;return s(),d(C,null,[e.value&&!u.value?(s(),d("div",se,[L(ae,{ad:e.value,showButtons:!1},null,8,["ad"]),e.value.live||e.value.status==h(m).SOLD?(s(),d("div",oe,[((n=h(x))==null?void 0:n.accountType)==h(O).BUYER?(s(),y(J,{key:0,onClick:V},{default:B(()=>[$("Place a bid")]),_:1})):i("",!0),_.value?(s(),d("div",de," Time left for bidding: "+K(_.value),1)):i("",!0),!o.value||o.value.length==0?(s(),d("span",ne,le)):i("",!0),o.value&&o.value.length>0?(s(),d("span",ue,[(s(!0),d(C,null,j(o.value,p=>(s(),y(te,{bid:p,showViewButton:!1},null,8,["bid"]))),256))])):i("",!0)])):(s(),d("div",re,[ce,e.value.live?i("",!0):(s(),y(Q,{key:0,disabled:e.value.live,isLoading:g.value,onClick:a[0]||(a[0]=p=>q(e.value.id))},{default:B(()=>[$(" Post ")]),_:1},8,["disabled","isLoading"]))]))])):i("",!0),u.value?(s(),d("div",ve,[L(X,{isLoading:u.value},null,8,["isLoading"])])):i("",!0)],64)}}});export{ge as default};
