import{e as i,f as r,k as e,d as V,u as K,K as Q,B as F,t as w,w as h,j as P,G as S,r as g,o as A,M as ie,p as c,C as x,A as $,F as k,m as j,L as O,N as W,O as L,q as y,T as B,v as b,a as X,P as Y,Q as Z,R as ee,S as se,U as H,H as z,g as te,V as ae,I as E,i as q,W as le,X as M,Y as re,Z as de,h as ce}from"./index-d604ebf2.js";import{I as oe}from"./ImageCarousel-67a385db.js";import{r as ue}from"./CheckCircleIcon-f8e1ea61.js";import{_ as fe,a as pe,b as me}from"./GigStoreCard.vue_vue_type_script_setup_true_lang-4ba42c2c.js";import{R as N,h as I,y as J,M as D}from"./menu-76956716.js";import"./PencilIcon-613fb7db.js";function R(l,a){return i(),r("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"})])}function ve(l,a){return i(),r("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"})])}const xe={class:"relative w-full max-h-32 rounded-xl overflow-hidden"},_e={key:1,class:"flex items-center justify-center h-full"},he=e("p",{class:"text-gray-500"},"No Image Available",-1),ge=[he],ye={class:"max-h-32"},be={class:"text-1xl font-bold"},we={class:"flex flex-row gap-2 text-sm justify-between"},$e={class:"font-semibold"},ke={class:"flex flex-row gap-2 text-sm"},Ce=V({__name:"SellerAdCarouselCard",props:{ad:{type:Object,required:!0}},emits:["edit"],setup(l,{emit:a}){const d=K(),s=m=>{m&&d.push({name:"ad",params:{adId:m}})};return(m,f)=>{const o=Q("currency");return i(),r("div",{class:"relative bg-white rounded-xl flex flex-col gap-2",onClick:f[0]||(f[0]=n=>s(l.ad.adId))},[e("div",xe,[l.ad.images&&l.ad.images.length>0?(i(),F(oe,{key:0,images:l.ad.resizedImages,classes:"max-h-32 w-32"},null,8,["images"])):(i(),r("div",_e,ge))]),e("div",ye,[e("h3",be,w(l.ad.variety),1),e("div",we,[h((i(),r("p",$e,[P("/tons")])),[[o,l.ad.pricePerTon]])]),e("div",ke,[e("p",null,w(l.ad.tons),1),P("tons ")])])])}}}),Ve={key:0,class:"flex flex-col justify-start sm:block bg-white p-2 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"},Te=["src"],je={class:"flex flex-col"},Pe={class:"text-md font-bold capitalize"},Se={key:0,class:"flex flex-row gap-1 divide-x"},Oe=e("p",{class:"text-xs italic pl-2"},"Verified",-1),Fe={class:"text-xs italic pl-2"},Ge={class:"text-xs italic pl-2"},Ue={class:"text-xs italic pl-2"},Ae={class:"grid grid-row-3 sm:grid-cols-3 gap-4"},Le={class:"flex flex-col gap-1 w-full"},Me={key:0},ze={class:"italic"},Be={key:1},Ne=e("p",null,"Producer not yet rated.",-1),Ie=[Ne],Je={class:"flex-row justify-between w-full divide-x flex gap-2"},De={class:"flex flex-col sm:p-2 w-full"},Re=e("p",{class:"text-md mb-2 font-bold"},"Shipping",-1),Ee={class:"flex flex-col p-2"},qe={class:"text-xs"},We={class:"text-xs italic pl-1"},He={class:"text-xs italic pl-1"},Ke={class:"flex flex-col sm:p-2 space-y-2 pl-2 w-full"},Qe=e("p",{class:"text-md mb-2 font-bold"},"Plant Count",-1),Xe={class:"flex flex-row justify-between gap-2"},Ye={class:"text-xs italic"},Ze={class:"text-xs italic"},es={key:0,class:"flex flex-row justify-between gap-2"},ss={key:1,class:"flex flex-row sm:justify-center"},ts={class:"sm:w-56"},ls=V({__name:"GroupedAdCard",props:{adGroup:{type:Object,required:!0}},setup(l){const a=l,d=S(()=>{const n=new Date,t=new Date(a.adGroup.createdAt.toDate().toString()),_=n.getTime()-t.getTime(),C=Math.floor(_/(1e3*60*60*24)),T=Math.floor(C/31),G=Math.floor(T/12);return G>0?`${G} yrs`:T>0?`${T} mths`:`${C} days`}),s=K(),m=(n,t)=>{console.log("go to seller ads",n),s.push({name:"seller-ads",params:{id:n,sellerName:t}})},f=g([]),o=g(!0);return A(async()=>{o.value=!0;const n=[];n.push(ie("ads","live","==",!0,"uid","==",a.adGroup.id,["postedOn","desc"],3).then(t=>{f.value=t.docs,o.value=!1})),await Promise.all(n)}),(n,t)=>l.adGroup?(i(),r("span",Ve,[e("span",{class:"flex flex-row gap-2 items-end mb-2",onClick:t[0]||(t[0]=_=>m(l.adGroup.id,l.adGroup.companyName))},[e("img",{src:l.adGroup.storeLogoResized,class:"w-10 h-10 rounded-md object-cover bg-slate-500"},null,8,Te),e("span",je,[e("h1",Pe,w(`${l.adGroup.companyName}'s ads`),1),l.adGroup.verifiedSeller?(i(),r("div",Se,[c(x(ue),{class:"h-4 w-4 text-sky-500"}),Oe,e("p",Fe,w(d.value),1),e("p",Ge,w(l.adGroup.staffNumber)+"+ staff",1),e("p",Ue,w(l.adGroup.acreage)+"+ acres",1)])):$("",!0)])]),e("span",Ae,[e("span",{class:"flex flex-row sm:p-2 sm:p-0",onClick:t[1]||(t[1]=_=>m(l.adGroup.id,l.adGroup.companyName))},[e("div",Le,[l.adGroup.rating?(i(),r("div",Me,[e("p",ze,[e("strong",null,w(l.adGroup.rating),1),P("/5 rating")])])):(i(),r("div",Be,Ie)),e("span",Je,[e("div",De,[Re,(i(!0),r(k,null,j(l.adGroup.shipping.slice(0,2),_=>(i(),r("li",Ee,[e("p",qe,w(_.type),1),e("p",We,"Up to "+w(_.distance)+"KMs",1),e("p",He,"Max: "+w(_.weight)+"KGs",1)]))),256))]),e("div",Ke,[Qe,(i(!0),r(k,null,j(l.adGroup.plants.slice(0,5),_=>(i(),r("li",Xe,[e("p",Ye,w(_.variety),1),e("p",Ze,w(_.amount),1)]))),256))])])])]),!o.value&&f.value.length>0?(i(),r("div",es,[(i(!0),r(k,null,j(f.value,_=>(i(),F(Ce,{ad:_,key:_.adId},null,8,["ad"]))),128))])):$("",!0),l.adGroup&&l.adGroup.storeImagesResized&&l.adGroup.storeImagesResized.length>0?(i(),r("div",ss,[e("div",ts,[c(oe,{images:l.adGroup.storeImagesResized,classes:"sm:h-56 sm:w-56"},null,8,["images"])])])):$("",!0)])])):$("",!0)}}),os={key:0,class:"grid grid grid-cols-1 gap-4"},ns={key:0},is=e("p",null,"No ads yet",-1),as=[is],rs={key:1},ds=V({__name:"GroupedAdsComponent",setup(l){const a=g(!1),d=g([]),s=async()=>{a.value=!0,d.value=await W("ads",["updatedAt","desc"],6),a.value=!1},m=async()=>{const f=d.value.lastVisible,o=await W("ads",["updatedAt","desc"],6,f);d.value={lastVisible:o.lastVisible,docs:[...d.value.docs,...o.docs]}};return A(async()=>{await s()}),(f,o)=>(i(),r(k,null,[e("div",null,[d.value&&d.value.docs&&d.value.docs.length>0&&!a.value?(i(),r("span",os,[(i(!0),r(k,null,j(d.value.docs,n=>(i(),F(ls,{adGroup:n,key:n.id},null,8,["adGroup"]))),128))])):$("",!0),e("div",{class:"flex flex-row justify-end"},[e("p",{onClick:m,class:"font-sm underline font-bold"}," View more ")])]),d.value&&d.value.docs&&d.value.docs.length==0&&!a.value?(i(),r("span",ns,as)):(i(),r("div",rs,[c(O,{isLoading:a.value},null,8,["isLoading"])]))],64))}}),cs={class:"relative sm:hidden"},us={class:"pt-2"},fs=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),ps={class:"divide-y"},ms={class:"py-4"},vs=e("p",{class:"text-sm mb-2"},"Quantity",-1),xs={class:"flex flex-row gap-2 items-center"},_s=e("p",null,"-",-1),hs={class:"py-4"},gs=e("p",{class:"text-sm mb-2"},"Price Per Ton",-1),ys={class:"flex flex-row gap-2 items-center"},bs=e("p",null,"-",-1),ws=e("span",{class:"py-4"},[e("div",{class:"flex flex-row gap-2 items-center"},[e("input",{type:"checkbox",id:"verifiedseller"}),e("label",{class:"text-sm",for:"verifiedseller"},"Verified Seller")]),e("div",{class:"flex flex-row gap-2 items-center"},[e("input",{type:"checkbox",id:"certifiedOrganic"}),e("label",{class:"text-sm",for:"verifiedseller"},"Certified Organic")]),e("div",{class:"flex flex-row gap-2 items-center"},[e("input",{type:"checkbox",id:"offersshipping"}),e("label",{class:"text-sm",for:"offersshipping"},"Offers shipping")])],-1),$s=["onClick"],ks=V({__name:"SellerCategoryFilterDropdownMenu",props:{filters:Object,selectableVariety:Array},emits:["updateFilters"],setup(l,{emit:a}){const d=l,s=g({});L(()=>d.filters,o=>{s.value=JSON.parse(JSON.stringify(o))},{deep:!0,immediate:!0});const m=a,f=()=>{m("updateFilters",s.value)};return(o,n)=>(i(),r("div",cs,[c(x(D),{as:"div",class:"relative inline-block text-left"},{default:y(()=>[e("div",null,[c(x(N),{class:"inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-bg/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"},{default:y(()=>[e("div",us,[c(x(R),{class:"h-10 w-10"})])]),_:1})]),c(B,{"enter-active-class":"transition duration-100 ease-out","enter-from-class":"transform scale-95 opacity-0","enter-to-class":"transform scale-100 opacity-100","leave-active-class":"transition duration-75 ease-in","leave-from-class":"transform scale-100 opacity-100","leave-to-class":"transform scale-95 opacity-0"},{default:y(()=>[c(x(I),{class:"absolute p-2 left-0 mt-2 z-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"},{default:y(()=>[fs,e("span",ps,[e("div",ms,[vs,e("div",xs,[h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[0]||(n[0]=t=>s.value.tons.min=t)},null,512),[[b,s.value.tons.min]]),_s,h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[1]||(n[1]=t=>s.value.tons.max=t)},null,512),[[b,s.value.tons.max]])])]),e("div",hs,[gs,e("div",ys,[h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[2]||(n[2]=t=>s.value.pricePerTon.min=t)},null,512),[[b,s.value.pricePerTon.min]]),bs,h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[3]||(n[3]=t=>s.value.pricePerTon.max=t)},null,512),[[b,s.value.pricePerTon.max]])])]),ws]),c(x(J),{class:"p-2"},{default:y(({close:t})=>[e("button",{type:"button",class:"w-full flex justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",onClick:()=>{f(),t()}}," Apply Filters ",8,$s)]),_:1})]),_:1})]),_:1})]),_:1})]))}}),Cs={class:"grid grid-cols-6 h-64 w-full mt-4 shadow border rounded-md overflow-hidden"},Vs=["onClick"],Ts={class:"absolute inset-0 hidden sm:flex items-center justify-center bg-slate-300/20 opacity-0 hover:opacity-100 transform duration-200 ease-in-out"},js={class:"text-sm font-bold capitalize text-white"},Ps=["src"],Ss={class:"flex flex-row gap-1 sm:gap-2 h-16 sm:p-4 sm:justify-end items-center"},Os={class:"flex flex-row gap-2 relative w-full"},Fs={class:"w-1/6 py-4 px-2 sticky top-24 h-64 hidden sm:block"},Gs=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),Us={class:"divide-y"},As={class:"py-4"},Ls=e("p",{class:"text-sm mb-2"},"Quantity",-1),Ms={class:"flex flex-row gap-2 items-center"},zs=e("p",null,"-",-1),Bs={class:"py-4"},Ns=e("p",{class:"text-sm mb-2"},"Price Per Ton",-1),Is={class:"flex flex-row gap-2 items-center"},Js=e("p",null,"-",-1),Ds=te('<span class="py-4"><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="verifiedseller"><label class="text-sm" for="verifiedseller">Verified Seller</label></div><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="certifiedOrganic"><label class="text-sm" for="verifiedseller">Certified Organic</label></div><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="offersshipping"><label class="text-sm" for="offersshipping">Offers shipping</label></div></span>',1),Rs={key:0,class:"grid grid-cols-2 md:grid-cols-3 w-full gap-2",id:"sellerAds"},Es={key:1,class:"w-full"},qs={class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-3 lg:col-span-4"},Ws={key:2,class:"w-full"},Hs=e("div",{class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-3 lg:col-span-4"},[e("p",{class:"text-xl font-bold"},"No Ads Found")],-1),Ks=[Hs],Qs={key:1,class:"h-64 w-full flex items-center justify-center"},Xs=V({__name:"SellerCategoryComponent",setup(l){const a=g([]),d=g(!1),s=g("");A(async()=>{d.value=!0;try{a.value=await X().getProduce();const u=Y();for(let p of a.value){const v=Z(u,p.categoryImage);p.imageUrl=await ee(v)}s.value=a.value[0].id,await _(s.value)}catch(u){console.error("Error loading produce:",u)}d.value=!1});const m=g(!1),f=g([]),o=g({pricePerTon:{min:0,max:1e3},tons:{min:0,max:1e3},verifiedSeller:!1,certifiedOrganic:!1,offersShipping:!1}),n=u=>{o.value={...u}},t=S(()=>!f.value.docs||f.value.docs.length===0?[]:f.value.docs.filter(p=>{const v=p.pricePerTon,U=p.tons;return v>=o.value.pricePerTon.min&&v<=o.value.pricePerTon.max&&U>=o.value.tons.min&&U<=o.value.tons.max})),_=async u=>{m.value=!0,f.value=await se("ads",[["type","==",u],["live","==",!0],["adType","==","seller"]],["postedOn","desc"],25),console.log("ads:",f.value),m.value=!1};L(s,async u=>{u&&await _(u)});const C=g(""),T=S(()=>{if(s.value==="")return[];const u=a.value.find(p=>p.id===s.value);return u?u.sub:[]}),G=()=>{const u=document.getElementById("sellerAds");u&&u.scrollIntoView({behavior:"smooth"})};return(u,p)=>x(d)?(i(),r("div",Qs,[c(O,{isLoading:x(d)},null,8,["isLoading"])])):(i(),r(k,{key:0},[e("div",Cs,[(i(!0),r(k,null,j(x(a),v=>(i(),r("span",{class:"relative inline-block",onClick:()=>{s.value=v.id,G()}},[e("span",Ts,[e("span",js,w(v.id),1)]),e("img",{src:v.imageUrl,class:"object-cover h-full w-full"},null,8,Ps)],8,Vs))),256))]),e("div",Ss,[c(ks,{filters:o.value,selectableVariety:T.value,onUpdateFilters:n},null,8,["filters","selectableVariety"]),c(z,{items:x(a),modelValue:x(s),"onUpdate:modelValue":p[0]||(p[0]=v=>H(s)?s.value=v:null),placeholder:"Select a Produce",itemLabel:"id"},null,8,["items","modelValue"]),c(z,{items:T.value,modelValue:x(C),"onUpdate:modelValue":p[1]||(p[1]=v=>H(C)?C.value=v:null),placeholder:"Select a Variety",disabled:T.value.length===0},null,8,["items","modelValue","disabled"])]),e("span",Os,[e("div",Fs,[Gs,e("span",Us,[e("div",As,[Ls,e("div",Ms,[h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":p[2]||(p[2]=v=>o.value.tons.min=v)},null,512),[[b,o.value.tons.min]]),zs,h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":p[3]||(p[3]=v=>o.value.tons.max=v)},null,512),[[b,o.value.tons.max]])])]),e("div",Bs,[Ns,e("div",Is,[h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":p[4]||(p[4]=v=>o.value.pricePerTon.min=v)},null,512),[[b,o.value.pricePerTon.min]]),Js,h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":p[5]||(p[5]=v=>o.value.pricePerTon.max=v)},null,512),[[b,o.value.pricePerTon.max]])])]),Ds])]),!x(m)&&t.value.length>0?(i(),r("div",Rs,[(i(!0),r(k,null,j(t.value,(v,U)=>(i(),F(fe,{ad:v,key:U,showButtons:!1},null,8,["ad"]))),128))])):$("",!0),x(s)&&x(m)?(i(),r("div",Es,[e("div",qs,[c(O,{isLoading:x(m)},null,8,["isLoading"])])])):$("",!0),x(s)&&!x(m)&&t.value.length==0?(i(),r("div",Ws,Ks)):$("",!0)])],64))}}),Ys={class:"table-fixed w-full border-collapse"},Zs={class:"truncate"},et={class:"flex flex-col sm:table-cell"},st={class:"flex flex-row items-center gap-2"},tt={class:"text-xs sm:text-sm"},lt={class:"sm:hidden text-xs sm:text-sm truncate"},ot={class:"hidden sm:table-cell"},nt={class:"text-sm truncate"},it={class:"hidden sm:table-cell"},at={class:"flex flex-row items-center gap-2"},rt={class:"hidden sm:table-cell"},dt={class:"italic text-sm"},ct={class:"sm:table-cell"},ut={class:"italic bg-slate-200 p-1 rounded-md text-center"},ft=V({__name:"BuyerStoreAdCard",props:{ad:{type:Object,required:!0}},setup(l){const a=s=>{const m=new Date,f=s.toDate(),o=m.getTime()-f.getTime(),n=Math.floor(o/1e3),t=Math.floor(n/60),_=Math.floor(t/60),C=Math.floor(_/24);return C>1?`${C} days ago`:C==1?`${C} day ago`:_>0?`${_} hours ago`:t>0?`${t} minutes ago`:n>0?`${n} seconds ago`:"just now"},d=()=>{console.log("clicked")};return(s,m)=>{const f=Q("currency");return i(),r("div",{class:"flex items-center shadow px-2 sm:p-2 h-16 cursor-pointer hover:bg-slate-300/20 transform transition-all",onClick:d},[e("table",Ys,[e("tbody",null,[e("tr",null,[e("td",null,[e("p",Zs,w(l.ad.variety),1)]),e("td",null,[e("div",et,[e("span",st,[c(x(ve),{class:"h-4 w-4"}),e("p",tt,"~"+w(l.ad.tons)+" tons",1)]),e("p",lt,[h(e("span",null,null,512),[[f,l.ad.minCostPerTon]]),P("-"),h(e("span",null,null,512),[[f,l.ad.maxCostPerTon]]),P("/ ton")])])]),e("td",ot,[e("p",nt,[h(e("span",null,null,512),[[f,l.ad.minCostPerTon]]),P("-"),h(e("span",null,null,512),[[f,l.ad.maxCostPerTon]]),P("/ ton")])]),e("td",it,[e("span",at,[c(x(ae),{class:"h-4 w-4"}),e("p",null,w(l.ad.location),1)])]),e("td",rt,[e("p",dt,w(l.ad.certifiedOrganic?"Certified Organic":"Not Certified Organic"),1)]),e("td",ct,[e("p",ut,w(a(l.ad.postedOn)),1)])])])])])}}}),pt={class:"relative sm:hidden"},mt={class:"pt-2"},vt=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),xt={class:"divide-y"},_t={class:"py-4"},ht=e("p",{class:"text-sm mb-2"},"Cost per Ton",-1),gt={class:"flex flex-row gap-2 items-center"},yt=e("p",null,"-",-1),bt={class:"py-4"},wt={class:"flex flex-row gap-2 items-center"},$t=e("label",{class:"text-sm",for:"verifiedseller"},"Verified Buyer",-1),kt={class:"flex flex-row gap-2 items-center"},Ct=e("label",{class:"text-sm",for:"certifiedOrganic truncate"},"Certified Organic",-1),Vt={class:"flex flex-row gap-2 items-center"},Tt=e("label",{class:"text-sm",for:"offersshipping"},"Offers shipping",-1),jt=["onClick"],Pt=V({__name:"BuyerCategoryFilterDropdownMenu",props:{filters:Object,selectableVariety:Array},emits:["updateFilters"],setup(l,{emit:a}){const d=l,s=g({});L(()=>d.filters,o=>{s.value=JSON.parse(JSON.stringify(o))},{deep:!0,immediate:!0});const m=a,f=()=>{m("updateFilters",s.value)};return(o,n)=>(i(),r("div",pt,[c(x(D),{as:"div",class:"relative inline-block text-left"},{default:y(()=>[e("div",null,[c(x(N),{class:"inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-bg/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"},{default:y(()=>[e("div",mt,[c(x(R),{class:"h-10 w-10"})])]),_:1})]),c(B,{"enter-active-class":"transition duration-100 ease-out","enter-from-class":"transform scale-95 opacity-0","enter-to-class":"transform scale-100 opacity-100","leave-active-class":"transition duration-75 ease-in","leave-from-class":"transform scale-100 opacity-100","leave-to-class":"transform scale-95 opacity-0"},{default:y(()=>[c(x(I),{class:"absolute p-2 left-0 mt-2 z-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"},{default:y(()=>[vt,e("span",xt,[e("div",_t,[ht,e("div",gt,[h(e("input",{type:"number",class:"text-xs border rounded-md w-1/2 p-2","onUpdate:modelValue":n[0]||(n[0]=t=>s.value.minCostPerTon=t),min:"0"},null,512),[[b,s.value.minCostPerTon]]),yt,h(e("input",{type:"number",class:"text-xs border rounded-md w-1/2 p-2","onUpdate:modelValue":n[1]||(n[1]=t=>s.value.maxCostPerTon=t),min:"0"},null,512),[[b,s.value.maxCostPerTon]])])]),e("span",bt,[e("div",wt,[h(e("input",{type:"checkbox",id:"verifiedseller","onUpdate:modelValue":n[2]||(n[2]=t=>s.value.verifiedSeller=t)},null,512),[[E,s.value.verifiedSeller]]),$t]),e("div",kt,[h(e("input",{type:"checkbox",id:"certifiedOrganic","onUpdate:modelValue":n[3]||(n[3]=t=>s.value.certifiedOrganic=t)},null,512),[[E,s.value.certifiedOrganic]]),Ct]),e("div",Vt,[h(e("input",{type:"checkbox",id:"offersshipping","onUpdate:modelValue":n[4]||(n[4]=t=>s.value.offersShipping=t)},null,512),[[E,s.value.offersShipping]]),Tt])])]),c(x(J),{class:"p-2"},{default:y(({close:t})=>[e("button",{type:"button",class:"w-full flex justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",onClick:()=>{f(),t()}}," Apply Filters ",8,jt)]),_:1})]),_:1})]),_:1})]),_:1})]))}}),St={class:"grid grid-cols-6 h-64 w-full mt-4 shadow border rounded-md overflow-hidden"},Ot=["onClick"],Ft={class:"absolute inset-0 flex items-center justify-center bg-slate-300/20 opacity-0 hover:opacity-100 transform duration-200 ease-in-out"},Gt={class:"text-sm font-bold capitalize text-white"},Ut=["src"],At={class:"flex flex-row gap-1 sm:gap-2 h-16 sm:p-4 sm:justify-end items-center"},Lt={class:"flex flex-row gap-2 relative w-full"},Mt={class:"w-1/6 py-4 px-2 sticky top-24 h-64 hidden sm:block"},zt=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),Bt={class:"divide-y"},Nt={class:"py-4"},It=e("p",{class:"text-sm mb-2"},"Cost per Ton",-1),Jt={class:"flex flex-row gap-2 items-center"},Dt=e("p",null,"-",-1),Rt=te('<span class="py-4"><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="verifiedseller"><label class="text-sm" for="verifiedseller">Verified Buyer</label></div><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="certifiedOrganic"><label class="text-sm" for="certifiedOrganic truncate">Certified Organic</label></div><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="offersshipping"><label class="text-sm" for="offersshipping">Offers shipping</label></div></span>',1),Et={key:0,class:"flex flex-col gap-2 w-fill sm:w-5/6 min-h-[500px]",id:"buyerAds"},qt={key:1,class:"w-full"},Wt={class:"h-96 w-full flex items-center justify-center w-full"},Ht={key:2,class:"w-full"},Kt=e("div",{class:"h-96 w-full flex items-center justify-center w-full"},[e("p",{class:"text-xl font-bold"},"No Ads Found")],-1),Qt=[Kt],Xt={key:1,class:"h-64 w-full flex items-center justify-center"},Yt=V({__name:"BuyerCategoryComponent",setup(l){const a=g([]),d=g(!1),s=g("");A(async()=>{d.value=!0;try{a.value=await X().getProduce();const u=Y();for(let p of a.value){const v=Z(u,p.categoryImage);p.imageUrl=await ee(v)}s.value=a.value[0].id,await _(s.value)}catch(u){console.error("Error loading produce:",u)}d.value=!1});const m=g(!1),f=g([]),o=q({minCostPerTon:0,maxCostPerTon:1e3,verifiedBuyer:!1,certifiedOrganic:!1,offersShipping:!1}),n=u=>{o.value={...u}},t=S(()=>!f.value.docs||f.value.docs.length===0?[]:f.value.docs.filter(u=>{let p=!0;return(u.minCostPerTon<o.minCostPerTon||u.maxCostPerTon>o.maxCostPerTon)&&(p=!1),o.verifiedBuyer&&!u.verifiedBuyer&&(p=!1),o.certifiedOrganic&&!u.certifiedOrganic&&(p=!1),o.offersShipping&&!u.offersShipping&&(p=!1),p})),_=async u=>{m.value=!0,f.value=await se("ads",[["type","==",u],["live","==",!0],["adType","==","buyer"]],["postedOn","desc"],25),console.log("ads:",f.value),m.value=!1};L(s,async u=>{u&&await _(u)});const C=g(""),T=S(()=>{if(s.value==="")return[];const u=a.value.find(p=>p.id===s.value);return u?u.sub:[]}),G=()=>{const u=document.getElementById("buyerAds");u&&u.scrollIntoView({behavior:"smooth"})};return(u,p)=>d.value?(i(),r("div",Xt,[c(O,{isLoading:d.value},null,8,["isLoading"])])):(i(),r(k,{key:0},[e("div",St,[(i(!0),r(k,null,j(a.value,v=>(i(),r("span",{class:"relative inline-block",onClick:()=>{s.value=v.id,G()}},[e("span",Ft,[e("span",Gt,w(v.id),1)]),e("img",{src:v.imageUrl,class:"object-cover h-full w-full"},null,8,Ut)],8,Ot))),256))]),e("div",At,[c(Pt,{filters:o,selectableVariety:T.value,onUpdateFilters:n},null,8,["filters","selectableVariety"]),c(z,{items:a.value,modelValue:s.value,"onUpdate:modelValue":p[0]||(p[0]=v=>s.value=v),placeholder:"Select a Produce",itemLabel:"id"},null,8,["items","modelValue"]),c(z,{items:T.value,modelValue:C.value,"onUpdate:modelValue":p[1]||(p[1]=v=>C.value=v),placeholder:"Select a Variety",disabled:T.value.length===0},null,8,["items","modelValue","disabled"])]),e("span",Lt,[e("div",Mt,[zt,e("span",Bt,[e("div",Nt,[It,e("div",Jt,[h(e("input",{type:"number",class:"text-xs border rounded-md w-1/2 p-2","onUpdate:modelValue":p[2]||(p[2]=v=>o.minCostPerTon=v),min:"0"},null,512),[[b,o.minCostPerTon]]),Dt,h(e("input",{type:"number",class:"text-xs border rounded-md w-1/2 p-2","onUpdate:modelValue":p[3]||(p[3]=v=>o.maxCostPerTon=v),min:"0"},null,512),[[b,o.maxCostPerTon]])])]),Rt])]),!m.value&&t.value.length>0?(i(),r("div",Et,[(i(!0),r(k,null,j(t.value,(v,U)=>(i(),F(ft,{ad:v,key:U,showButtons:!1},null,8,["ad"]))),128))])):$("",!0),s.value&&m.value?(i(),r("div",qt,[e("div",Wt,[c(O,{isLoading:m.value},null,8,["isLoading"])])])):$("",!0),s.value&&!m.value&&t.value.length==0?(i(),r("div",Ht,Qt)):$("",!0)])],64))}}),Zt={class:"relative sm:hidden"},el={class:"pt-2"},sl=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),tl={class:"divide-y"},ll={class:"py-4"},ol=e("p",{class:"text-sm mb-2"},"Salary",-1),nl={class:"flex flex-row gap-2 items-center"},il=e("p",null,"-",-1),al=["onClick"],rl=V({__name:"JobCategoryFilterDropdownMenu",props:{filters:Object},emits:["updateFilters"],setup(l,{emit:a}){const d=l,s=g({});L(()=>d.filters,o=>{s.value=JSON.parse(JSON.stringify(o))},{deep:!0,immediate:!0});const m=a,f=()=>{m("updateFilters",s.value)};return(o,n)=>(i(),r("div",Zt,[c(x(D),{as:"div",class:"relative inline-block text-left"},{default:y(()=>[e("div",null,[c(x(N),{class:"inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-bg/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"},{default:y(()=>[e("div",el,[c(x(R),{class:"h-10 w-10"})])]),_:1})]),c(B,{"enter-active-class":"transition duration-100 ease-out","enter-from-class":"transform scale-95 opacity-0","enter-to-class":"transform scale-100 opacity-100","leave-active-class":"transition duration-75 ease-in","leave-from-class":"transform scale-100 opacity-100","leave-to-class":"transform scale-95 opacity-0"},{default:y(()=>[c(x(I),{class:"absolute p-2 left-0 mt-2 z-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"},{default:y(()=>[sl,e("span",tl,[e("div",ll,[ol,e("div",nl,[h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[0]||(n[0]=t=>l.filters.min=t)},null,512),[[b,l.filters.min]]),il,h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[1]||(n[1]=t=>l.filters.max=t)},null,512),[[b,l.filters.max]])])])]),c(x(J),{class:"p-2"},{default:y(({close:t})=>[e("button",{type:"button",class:"w-full flex justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",onClick:()=>{f(),t()}}," Apply Filters ",8,al)]),_:1})]),_:1})]),_:1})]),_:1})]))}}),dl={class:"flex flex-row gap-1 sm:gap-2 h-16 sm:p-4 sm:justify-end items-center sm:hidden"},cl={class:"flex flex-row gap-2 relative w-full"},ul={class:"w-1/6 py-4 px-2 sticky top-24 h-64 hidden sm:block"},fl=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),pl={class:"divide-y"},ml={class:"py-4"},vl=e("p",{class:"text-sm mb-2"},"Salary",-1),xl={class:"flex flex-row gap-2 items-center"},_l=e("p",null,"-",-1),hl={class:"grid grid-cols-2 md:grid-cols-3 w-full gap-2 sm:p-2"},gl={key:1,class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3"},yl={key:2,class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3"},bl=e("p",{class:"text-xl font-bold"},"No Jobs Found",-1),wl=[bl],$l=V({__name:"JobCategoryComponent",setup(l){const a=g([]),d=g(!1),s=q({min:0,max:1e5}),m=S(()=>a.value.filter(o=>o.salaryMin>=s.min&&o.salaryMax<=s.max)),f=o=>{s.value={...o}};return A(async()=>{d.value=!0;const o=await le("jobs","live","==",!0,["updatedAt","desc"],25);a.value=o.docs,d.value=!1}),(o,n)=>(i(),r(k,null,[e("div",dl,[c(rl,{filters:s,onUpdateFilters:f},null,8,["filters"])]),e("span",cl,[e("div",ul,[fl,e("span",pl,[e("div",ml,[vl,e("div",xl,[h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[0]||(n[0]=t=>s.min=t)},null,512),[[b,s.min]]),_l,h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[1]||(n[1]=t=>s.max=t)},null,512),[[b,s.max]])])])])]),e("div",hl,[m.value.length>0&&!d.value?(i(!0),r(k,{key:0},j(m.value,(t,_)=>(i(),F(pe,{job:t,showButtons:!1,key:_},null,8,["job"]))),128)):d.value?(i(),r("div",gl,[c(O,{isLoading:d.value},null,8,["isLoading"])])):(i(),r("div",yl,wl))])])],64))}}),kl={class:"relative sm:hidden"},Cl={class:"pt-2"},Vl=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),Tl={class:"divide-y"},jl={class:"py-4"},Pl=e("p",{class:"text-sm mb-2"},"Salary",-1),Sl={class:"flex flex-row gap-2 items-center"},Ol=e("p",null,"-",-1),Fl=["onClick"],Gl=V({__name:"GigCategoryFilterDropdownMenu",props:{filters:Object},emits:["updateFilters"],setup(l,{emit:a}){const d=l,s=g({});L(()=>d.filters,o=>{s.value=JSON.parse(JSON.stringify(o))},{deep:!0,immediate:!0});const m=a,f=()=>{m("updateFilters",s.value)};return(o,n)=>(i(),r("div",kl,[c(x(D),{as:"div",class:"relative inline-block text-left"},{default:y(()=>[e("div",null,[c(x(N),{class:"inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-bg/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"},{default:y(()=>[e("div",Cl,[c(x(R),{class:"h-10 w-10"})])]),_:1})]),c(B,{"enter-active-class":"transition duration-100 ease-out","enter-from-class":"transform scale-95 opacity-0","enter-to-class":"transform scale-100 opacity-100","leave-active-class":"transition duration-75 ease-in","leave-from-class":"transform scale-100 opacity-100","leave-to-class":"transform scale-95 opacity-0"},{default:y(()=>[c(x(I),{class:"absolute p-2 left-0 mt-2 z-10 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"},{default:y(()=>[Vl,e("span",Tl,[e("div",jl,[Pl,e("div",Sl,[h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[0]||(n[0]=t=>l.filters.min=t)},null,512),[[b,l.filters.min]]),Ol,h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[1]||(n[1]=t=>l.filters.max=t)},null,512),[[b,l.filters.max]])])])]),c(x(J),{class:"p-2"},{default:y(({close:t})=>[e("button",{type:"button",class:"w-full flex justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",onClick:()=>{f(),t()}}," Apply Filters ",8,Fl)]),_:1})]),_:1})]),_:1})]),_:1})]))}}),Ul={class:"flex flex-row gap-1 sm:gap-2 h-16 sm:p-4 sm:justify-end items-center sm:hidden"},Al={class:"flex flex-row gap-2 relative w-full"},Ll={class:"w-1/6 py-4 px-2 sticky top-24 h-64 hidden sm:block"},Ml=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),zl={class:"divide-y"},Bl={class:"py-4"},Nl=e("p",{class:"text-sm mb-2"},"Salary",-1),Il={class:"flex flex-row gap-2 items-center"},Jl=e("p",null,"-",-1),Dl={class:"grid grid-cols-2 md:grid-cols-3 w-full gap-2 sm:p-2"},Rl={key:1,class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3"},El={key:2,class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3"},ql=e("p",{class:"text-xl font-bold"},"No Gigs Found",-1),Wl=[ql],Hl=V({__name:"GigCategoryComponent",setup(l){const a=g([]),d=g(!1),s=q({min:0,max:1e4}),m=S(()=>a.value.filter(o=>{const n=o.milestones.reduce((t,_)=>t+_.price,0);return n>=s.min&&n<=s.max})),f=o=>{s.value={...o}};return A(async()=>{d.value=!0;const o=await le("gigs","live","==",!0,["updatedAt","desc"],25);a.value=o.docs,d.value=!1}),(o,n)=>(i(),r(k,null,[e("div",Ul,[c(Gl,{filters:s,onUpdateFilters:f},null,8,["filters"])]),e("span",Al,[e("div",Ll,[Ml,e("span",zl,[e("div",Bl,[Nl,e("div",Il,[h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[0]||(n[0]=t=>s.min=t)},null,512),[[b,s.min]]),Jl,h(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":n[1]||(n[1]=t=>s.max=t)},null,512),[[b,s.max]])])])])]),e("div",Dl,[m.value.length>0&&!d.value?(i(!0),r(k,{key:0},j(m.value,(t,_)=>(i(),F(me,{gig:t,showButtons:!1,key:_},null,8,["gig"]))),128)):d.value?(i(),r("div",Rl,[c(O,{isLoading:d.value},null,8,["isLoading"])])):(i(),r("div",El,Wl))])])],64))}}),ne=l=>(re("data-v-81c1d38e"),l=l(),de(),l),Kl={class:"relative flex items-center justify-center h-48 md:h-64 shadow rounded-md p-4"},Ql=ne(()=>e("div",{id:"banner",class:"absolute top-0 left-0 h-48 md:h-64 w-full bg-cover bg-center rounded-md -z-1 opacity-30"},null,-1)),Xl=ne(()=>e("div",{class:"absolute top-0 left-0 h-48 md:h-64 w-full bg-slate-800/80 rounded-md z-1"},null,-1)),Yl={class:"flex flex-row gap-1 sm:gap-2 z-[7]"},Zl={key:0,class:"p-2"},eo={key:1},so={key:2},to={key:3},lo={key:4},oo=V({__name:"FeedView",setup(l){const a=g(0);return(d,s)=>(i(),r(k,null,[e("div",Kl,[Ql,Xl,e("span",Yl,[e("h1",{class:M(["text-lg sm:text-2xl md:text-3xl font-bold hover:underline",a.value==0?"text-cyan-500 underline":""]),onClick:s[0]||(s[0]=()=>a.value=0)},"Producers",2),e("h1",{class:M(["text-lg sm:text-2xl md:text-3xl font-bold hover:underline",a.value==1?"text-cyan-500 underline":""]),onClick:s[1]||(s[1]=()=>a.value=1)},"Products",2),e("h1",{class:M(["text-lg sm:text-2xl md:text-3xl font-bold hover:underline",a.value==2?"text-cyan-500 underline":""]),onClick:s[2]||(s[2]=()=>a.value=2)},"Buyers",2),e("h1",{class:M(["text-lg sm:text-2xl md:text-3xl font-bold hover:underline",a.value==3?"text-cyan-500 underline":""]),onClick:s[3]||(s[3]=()=>a.value=3)},"Jobs",2),e("h1",{class:M(["text-lg sm:text-2xl md:text-3xl font-bold hover:underline",a.value==4?"text-cyan-500 underline":""]),onClick:s[4]||(s[4]=()=>a.value=4)},"Gigs",2)])]),a.value==0?(i(),r("div",Zl,[c(ds)])):$("",!0),a.value==1?(i(),r("div",eo,[c(Xs)])):$("",!0),a.value==2?(i(),r("div",so,[c(Yt)])):$("",!0),a.value==3?(i(),r("div",to,[c($l)])):$("",!0),a.value==4?(i(),r("div",lo,[c(Hl)])):$("",!0)],64))}});const fo=ce(oo,[["__scopeId","data-v-81c1d38e"]]);export{fo as default};