import{e as s,f as l,g as e,d as k,u as z,I,y as P,t as h,w as y,i as L,B as T,h as _,o as j,J as Z,m as x,z as B,x as g,F as w,k as $,L as G,K as M,a as N,M as F,N as D,O as R,r as U,P as J,Q as E,C as O,v as b,R as W,S as ee,D as se,T as q,U as A,V as te,W as le,H as oe}from"./index-8dd656b9.js";import{I as K}from"./ImageCarousel-90e0a058.js";import{r as ae}from"./CheckCircleIcon-b4f5dc26.js";import{_ as ne,a as ie,b as de}from"./GigStoreCard.vue_vue_type_script_setup_true_lang-c97ae272.js";import"./PencilIcon-404dff3f.js";function re(n,o){return s(),l("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"})])}const ce={class:"relative w-full h-28 rounded-xl overflow-hidden"},ue={key:1,class:"flex items-center justify-center h-full"},fe=e("p",{class:"text-gray-500"},"No Image Available",-1),pe=[fe],me={class:"mt-4 space-y-2"},ve={class:"text-1xl font-bold"},_e={class:"flex flex-row gap-2 text-sm justify-between"},xe={class:"font-semibold"},he={class:"flex flex-row gap-2 text-sm justify-between"},ge=k({__name:"SellerAdCarouselCard",props:{ad:{type:Object,required:!0}},emits:["edit"],setup(n,{emit:o}){const i=z(),t=p=>{p&&i.push({name:"ad",params:{adId:p}})};return(p,f)=>{const a=I("currency");return s(),l("div",{class:"relative bg-white rounded-xl",onClick:f[0]||(f[0]=c=>t(n.ad.adId))},[e("div",ce,[n.ad.images&&n.ad.images.length>0?(s(),P(K,{key:0,images:n.ad.resizedImages,classes:"h-32 w-32"},null,8,["images"])):(s(),l("div",ue,pe))]),e("div",me,[e("h3",ve,h(n.ad.variety),1),e("div",_e,[y((s(),l("p",xe,[L("/tons")])),[[a,n.ad.pricePerTon]])]),e("div",he,[e("p",null,h(n.ad.tons),1),L("tons ")])])])}}}),ye={key:0,class:"bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"},we={class:"grid grid-cols-3"},be={class:"flex flex-row"},$e={class:"flex flex-col gap-1"},ke={class:"flex flex-row gap-2 items-end mb-2"},Ce=["src"],Ve={class:"flex flex-col"},Te={key:0,class:"flex flex-row gap-1 divide-x"},Ge=e("p",{class:"text-xs italic pl-2"},"Verified",-1),Pe={class:"text-xs italic pl-2"},je={class:"text-xs italic pl-2"},Se={class:"text-xs italic pl-2"},Ae={key:0},Le={class:"italic"},Oe={key:1},Ue=e("p",null,"Producer not yet rated.",-1),Be=[Ue],Me={class:"flex flex-row w-full divide-x"},ze={class:"flex flex-col p-2"},Ie=e("p",{class:"text-md mb-2 font-bold"},"Shipping",-1),Ne={class:"flex flex-col p-2"},Fe={class:"text-xs"},De={class:"text-xs italic pl-1"},Re={class:"text-xs italic pl-1"},Je={class:"flex flex-col p-2 space-y-2"},Ee=e("p",{class:"text-md mb-2 font-bold"},"Plants",-1),We={class:"flex flex-row justify-between gap-2"},qe={class:"text-xs italic"},Ke={class:"text-xs italic"},Qe={key:0,class:"flex flex-row justify-between gap-2"},He={key:1,class:"flex flex-row justify-center"},Xe={class:"w-56"},Ye=k({__name:"GroupedAdCard",props:{adGroup:{type:Object,required:!0}},setup(n){const o=n,i=T(()=>{const c=new Date,m=new Date(o.adGroup.createdAt.toDate().toString()),v=c.getTime()-m.getTime(),C=Math.floor(v/(1e3*60*60*24)),V=Math.floor(C/31),u=Math.floor(V/12);return u>0?`${u} yrs`:V>0?`${V} mths`:`${C} days`}),t=z(),p=(c,m)=>{console.log("go to seller ads",c),t.push({name:"seller-ads",params:{id:c,sellerName:m}})},f=_([]),a=_(!0);return j(async()=>{a.value=!0;const c=[];c.push(Z("ads","live","==",!0,"uid","==",o.adGroup.id,["postedOn","desc"],3).then(m=>{f.value=m.docs,a.value=!1})),await Promise.all(c)}),(c,m)=>n.adGroup?(s(),l("span",ye,[e("span",we,[e("span",be,[e("div",$e,[e("span",ke,[e("img",{src:n.adGroup.storeLogoResized,class:"w-10 h-10 rounded-md object-cover bg-slate-500",onClick:m[0]||(m[0]=v=>p(n.adGroup.id,n.adGroup.companyName))},null,8,Ce),e("span",Ve,[e("h1",{class:"text-md font-bold capitalize",onClick:m[1]||(m[1]=v=>p(n.adGroup.id,n.adGroup.companyName))},h(`${n.adGroup.companyName}'s ads`),1),n.adGroup.verifiedSeller?(s(),l("div",Te,[x(B(ae),{class:"h-4 w-4 text-sky-500"}),Ge,e("p",Pe,h(i.value),1),e("p",je,h(n.adGroup.staffNumber)+"+ staff",1),e("p",Se,h(n.adGroup.acreage)+"+ acres",1)])):g("",!0)])]),n.adGroup.rating?(s(),l("div",Ae,[e("p",Le,[e("strong",null,h(n.adGroup.rating),1),L("/5 rating")])])):(s(),l("div",Oe,Be)),e("span",Me,[e("div",ze,[Ie,(s(!0),l(w,null,$(n.adGroup.shipping.slice(0,2),v=>(s(),l("li",Ne,[e("p",Fe,h(v.type),1),e("p",De,"Up to "+h(v.distance)+"KMs",1),e("p",Re,"Max: "+h(v.weight)+"KGs",1)]))),256))]),e("div",Je,[Ee,(s(!0),l(w,null,$(n.adGroup.plants.slice(0,5),v=>(s(),l("li",We,[e("p",qe,h(v.variety),1),e("p",Ke,h(v.amount),1)]))),256))])])])]),!a.value&&f.value.length>0?(s(),l("div",Qe,[(s(!0),l(w,null,$(f.value,v=>(s(),P(ge,{ad:v,key:v.adId},null,8,["ad"]))),128))])):g("",!0),n.adGroup&&n.adGroup.storeImagesResized&&n.adGroup.storeImagesResized.length>0?(s(),l("div",He,[e("div",Xe,[x(K,{images:n.adGroup.storeImagesResized,classes:"h-56 w-56"},null,8,["images"])])])):g("",!0)])])):g("",!0)}}),Ze={key:0,class:"grid grid grid-cols-1 gap-4"},es={key:0},ss=e("p",null,"No ads yet",-1),ts=[ss],ls={key:1},os=k({__name:"GroupedAdsComponent",setup(n){const o=_(!1),i=_([]),t=async()=>{o.value=!0,i.value=await M("ads",["updatedAt","desc"],6),o.value=!1},p=async()=>{const f=i.value.lastVisible,a=await M("ads",["updatedAt","desc"],6,f);i.value={lastVisible:a.lastVisible,docs:[...i.value.docs,...a.docs]}};return j(async()=>{await t()}),(f,a)=>(s(),l(w,null,[e("div",null,[i.value&&i.value.docs&&i.value.docs.length>0&&!o.value?(s(),l("span",Ze,[(s(!0),l(w,null,$(i.value.docs,c=>(s(),P(Ye,{adGroup:c,key:c.id},null,8,["adGroup"]))),128))])):g("",!0),e("div",{class:"flex flex-row justify-end"},[e("p",{onClick:p,class:"font-sm underline font-bold"}," View more ")])]),i.value&&i.value.docs&&i.value.docs.length==0&&!o.value?(s(),l("span",es,ts)):(s(),l("div",ls,[x(G,{isLoading:o.value},null,8,["isLoading"])]))],64))}}),as={class:"grid grid-cols-6 h-64 w-full mt-4 shadow border rounded-md overflow-hidden"},ns=["onClick"],is={class:"absolute inset-0 flex items-center justify-center bg-slate-300/20 opacity-0 hover:opacity-100 transform duration-200 ease-in-out"},ds={class:"text-sm font-bold capitalize text-white"},rs=["src"],cs={class:"flex flex-row gap-2 h-16 p-4 justify-end"},us={class:"flex flex-row gap-2 relative w-full"},fs={class:"w-1/6 py-4 px-2 sticky top-24 h-64"},ps=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),ms={class:"divide-y"},vs={class:"py-4"},_s=e("p",{class:"text-sm mb-2"},"Quantity",-1),xs={class:"flex flex-row gap-2 items-center"},hs=e("p",null,"-",-1),gs={class:"py-4"},ys=e("p",{class:"text-sm mb-2"},"Price Per Ton",-1),ws={class:"flex flex-row gap-2 items-center"},bs=e("p",null,"-",-1),$s=W('<span class="py-4"><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="verifiedseller"><label class="text-sm" for="verifiedseller">Verified Seller</label></div><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="certifiedOrganic"><label class="text-sm" for="verifiedseller">Certified Organic</label></div><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="offersshipping"><label class="text-sm" for="offersshipping">Offers shipping</label></div></span>',1),ks={key:0,class:"grid sm:grid-cols-2 md:grid-cols-3 w-full gap-2",id:"sellerAds"},Cs={key:1,class:"w-full"},Vs={class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-3 lg:col-span-4"},Ts={key:2,class:"w-full"},Gs=e("div",{class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-3 lg:col-span-4"},[e("p",{class:"text-xl font-bold"},"No Ads Found")],-1),Ps=[Gs],js={key:1,class:"h-64 w-full flex items-center justify-center"},Ss=k({__name:"SellerCategoryComponent",setup(n){const o=_([]),i=_(!1),t=_("");j(async()=>{i.value=!0;try{o.value=await N().getProduce();const u=F();for(let d of o.value){const r=D(u,d.categoryImage);d.imageUrl=await R(r)}t.value=o.value[0].id,await m(t.value)}catch(u){console.error("Error loading produce:",u)}i.value=!1});const p=_(!1),f=_([]),a=U({pricePerTon:{min:0,max:1e3},tons:{min:0,max:1e3},verifiedSeller:!1,certifiedOrganic:!1,offersShipping:!1}),c=T(()=>!f.value.docs||f.value.docs.length===0?[]:f.value.docs),m=async u=>{p.value=!0,f.value=await J("ads",[["type","==",u],["live","==",!0],["adType","==","seller"]],["postedOn","desc"],25),console.log("ads:",f.value),p.value=!1};E(t,async u=>{u&&await m(u)});const v=_(""),C=T(()=>{if(t.value==="")return[];const u=o.value.find(d=>d.id===t.value);return u?u.sub:[]}),V=()=>{const u=document.getElementById("sellerAds");u&&u.scrollIntoView({behavior:"smooth"})};return(u,d)=>i.value?(s(),l("div",js,[x(G,{isLoading:i.value},null,8,["isLoading"])])):(s(),l(w,{key:0},[e("div",as,[(s(!0),l(w,null,$(o.value,r=>(s(),l("span",{class:"relative inline-block",onClick:()=>{t.value=r.id,V()}},[e("span",is,[e("span",ds,h(r.id),1)]),e("img",{src:r.imageUrl,class:"object-cover h-full w-full"},null,8,rs)],8,ns))),256))]),e("div",cs,[x(O,{items:o.value,modelValue:t.value,"onUpdate:modelValue":d[0]||(d[0]=r=>t.value=r),placeholder:"Select a Produce",itemLabel:"id"},null,8,["items","modelValue"]),x(O,{items:C.value,modelValue:v.value,"onUpdate:modelValue":d[1]||(d[1]=r=>v.value=r),placeholder:"Select a Variety",disabled:C.value.length===0},null,8,["items","modelValue","disabled"])]),e("span",us,[e("div",fs,[ps,e("span",ms,[e("div",vs,[_s,e("div",xs,[y(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":d[2]||(d[2]=r=>a.tons.min=r)},null,512),[[b,a.tons.min]]),hs,y(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":d[3]||(d[3]=r=>a.tons.max=r)},null,512),[[b,a.tons.max]])])]),e("div",gs,[ys,e("div",ws,[y(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":d[4]||(d[4]=r=>a.pricePerTon.min=r)},null,512),[[b,a.pricePerTon.min]]),bs,y(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":d[5]||(d[5]=r=>a.pricePerTon.max=r)},null,512),[[b,a.pricePerTon.max]])])]),$s])]),!p.value&&c.value.length>0?(s(),l("div",ks,[(s(!0),l(w,null,$(c.value,(r,S)=>(s(),P(ne,{ad:r,key:S,showButtons:!1},null,8,["ad"]))),128))])):g("",!0),t.value&&p.value?(s(),l("div",Cs,[e("div",Vs,[x(G,{isLoading:p.value},null,8,["isLoading"])])])):g("",!0),t.value&&!p.value&&c.value.length==0?(s(),l("div",Ts,Ps)):g("",!0)])],64))}}),As={class:"flex items-center shadow p-2 h-16 cursor-pointer"},Ls={class:"table-fixed w-full border-collapse"},Os={class:"flex flex-row items-center gap-2"},Us={class:"text-sm"},Bs={class:"flex flex-row items-center gap-2"},Ms={class:"italic text-sm"},zs={class:"italic bg-slate-200 p-1 rounded-md text-center"},Is=k({__name:"BuyerStoreAdCard",props:{ad:{type:Object,required:!0}},setup(n){const o=i=>{const t=new Date,p=i.toDate(),f=t.getTime()-p.getTime(),a=Math.floor(f/1e3),c=Math.floor(a/60),m=Math.floor(c/60),v=Math.floor(m/24);return v>1?`${v} days ago`:v==1?`${v} day ago`:m>0?`${m} hours ago`:c>0?`${c} minutes ago`:a>0?`${a} seconds ago`:"just now"};return(i,t)=>{const p=I("currency");return s(),l("div",As,[e("table",Ls,[e("tbody",null,[e("tr",null,[e("td",null,[e("p",null,h(n.ad.variety),1)]),e("td",null,[e("span",Os,[x(B(re),{class:"h-4 w-4"}),e("p",null,"~"+h(n.ad.tons)+" tons",1)])]),e("td",null,[e("p",Us,[y(e("span",null,null,512),[[p,n.ad.minCostPerTon]]),L("-"),y(e("span",null,null,512),[[p,n.ad.maxCostPerTon]]),L("/ ton")])]),e("td",null,[e("span",Bs,[x(B(ee),{class:"h-4 w-4"}),e("p",null,h(n.ad.location),1)])]),e("td",null,[e("p",Ms,h(n.ad.certifiedOrganic?"Certified Organic":"Not Certified Organic"),1)]),e("td",null,[e("p",zs,h(o(n.ad.postedOn)),1)])])])])])}}}),Ns={class:"grid grid-cols-6 h-64 w-full mt-4 shadow border rounded-md overflow-hidden"},Fs=["onClick"],Ds={class:"absolute inset-0 flex items-center justify-center bg-slate-300/20 opacity-0 hover:opacity-100 transform duration-200 ease-in-out"},Rs={class:"text-sm font-bold capitalize text-white"},Js=["src"],Es={class:"flex flex-row gap-2 h-16 p-4 justify-end"},Ws={class:"flex flex-row gap-2 relative w-full"},qs={class:"w-1/6 py-4 px-2 sticky top-24"},Ks=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),Qs={class:"divide-y"},Hs={class:"py-4 flex flex-row gap-2 items-center"},Xs=e("label",{class:"text-sm",for:"seeAll"},"See all",-1),Ys={class:"py-4"},Zs=e("p",{class:"text-sm mb-2"},"Cost per Ton",-1),et={class:"flex flex-row gap-2 items-center"},st=e("p",null,"-",-1),tt=W('<span class="py-4"><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="verifiedseller"><label class="text-sm" for="verifiedseller">Verified Buyer</label></div><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="certifiedOrganic"><label class="text-sm" for="certifiedOrganic truncate">Certified Organic</label></div><div class="flex flex-row gap-2 items-center"><input type="checkbox" id="offersshipping"><label class="text-sm" for="offersshipping">Offers shipping</label></div></span>',1),lt={key:0,class:"flex flex-col gap-2 w-5/6",id:"buyerAds"},ot={key:1,class:"w-full"},at={class:"h-96 w-full flex items-center justify-center w-full"},nt={key:2,class:"w-full"},it=e("div",{class:"h-96 w-full flex items-center justify-center w-full"},[e("p",{class:"text-xl font-bold"},"No Ads Found")],-1),dt=[it],rt={key:1,class:"h-64 w-full flex items-center justify-center"},ct=k({__name:"BuyerCategoryComponent",setup(n){const o=_([]),i=_(!1),t=_("");j(async()=>{i.value=!0;try{o.value=await N().getProduce();const u=F();for(let d of o.value){const r=D(u,d.categoryImage);d.imageUrl=await R(r)}t.value=o.value[0].id,await m(t.value)}catch(u){console.error("Error loading produce:",u)}i.value=!1});const p=_(!1),f=_([]),a=U({minCostPerTon:0,maxCostPerTon:1e3,verifiedBuyer:!1,certifiedOrganic:!1,offersShipping:!1,all:!0}),c=T(()=>{if(!f.value.docs||f.value.docs.length===0)return[];const u=f.value.docs.filter(d=>{if(a.all)return!0;const r=d.minCostPerTon,S=d.maxCostPerTon,H=d.verifiedBuyer,X=d.certifiedOrganic,Y=d.offersShipping;return r>=a.minCostPerTon&&S<=a.maxCostPerTon&&H===a.verifiedBuyer&&X===a.certifiedOrganic&&Y===a.offersShipping});return t.value&&v.value?u.filter(d=>d.variety===v.value):u}),m=async u=>{p.value=!0,f.value=await J("ads",[["type","==",u],["live","==",!0],["adType","==","buyer"]],["postedOn","desc"],25),console.log("ads:",f.value),p.value=!1};E(t,async u=>{u&&await m(u)});const v=_(""),C=T(()=>{if(t.value==="")return[];const u=o.value.find(d=>d.id===t.value);return u?u.sub:[]}),V=()=>{const u=document.getElementById("buyerAds");u&&u.scrollIntoView({behavior:"smooth"})};return(u,d)=>i.value?(s(),l("div",rt,[x(G,{isLoading:i.value},null,8,["isLoading"])])):(s(),l(w,{key:0},[e("div",Ns,[(s(!0),l(w,null,$(o.value,r=>(s(),l("span",{class:"relative inline-block",onClick:()=>{t.value=r.id,V()}},[e("span",Ds,[e("span",Rs,h(r.id),1)]),e("img",{src:r.imageUrl,class:"object-cover h-full w-full"},null,8,Js)],8,Fs))),256))]),e("div",Es,[x(O,{items:o.value,modelValue:t.value,"onUpdate:modelValue":d[0]||(d[0]=r=>t.value=r),placeholder:"Select a Produce",itemLabel:"id"},null,8,["items","modelValue"]),x(O,{items:C.value,modelValue:v.value,"onUpdate:modelValue":d[1]||(d[1]=r=>v.value=r),placeholder:"Select a Variety",disabled:C.value.length===0},null,8,["items","modelValue","disabled"])]),e("span",Ws,[e("div",qs,[Ks,e("span",Qs,[e("div",Hs,[y(e("input",{type:"checkbox",id:"seeAll","onUpdate:modelValue":d[2]||(d[2]=r=>a.all=r)},null,512),[[se,a.all]]),Xs]),e("div",Ys,[Zs,e("div",et,[y(e("input",{type:"number",class:"text-xs border rounded-md w-1/2 p-2","onUpdate:modelValue":d[3]||(d[3]=r=>a.minCostPerTon=r),min:"0"},null,512),[[b,a.minCostPerTon]]),st,y(e("input",{type:"number",class:"text-xs border rounded-md w-1/2 p-2","onUpdate:modelValue":d[4]||(d[4]=r=>a.maxCostPerTon=r),min:"0"},null,512),[[b,a.maxCostPerTon]])])]),tt])]),!p.value&&c.value.length>0?(s(),l("div",lt,[(s(!0),l(w,null,$(c.value,(r,S)=>(s(),P(Is,{ad:r,key:S,showButtons:!1},null,8,["ad"]))),128))])):g("",!0),t.value&&p.value?(s(),l("div",ot,[e("div",at,[x(G,{isLoading:p.value},null,8,["isLoading"])])])):g("",!0),t.value&&!p.value&&c.value.length==0?(s(),l("div",nt,dt)):g("",!0)])],64))}}),ut={class:"flex flex-row gap-2 relative w-full"},ft={class:"w-1/6 py-4 px-2 sticky top-24 h-64"},pt=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),mt={class:"divide-y"},vt={class:"py-4"},_t=e("p",{class:"text-sm mb-2"},"Salary",-1),xt={class:"flex flex-row gap-2 items-center"},ht=e("p",null,"-",-1),gt={class:"p-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"},yt={key:1,class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3"},wt={key:2,class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3"},bt=e("p",{class:"text-xl font-bold"},"No Jobs Found",-1),$t=[bt],kt=k({__name:"JobCategoryComponent",setup(n){const o=_([]),i=_(!1),t=U({min:0,max:1e5}),p=T(()=>o.value.filter(f=>f.salaryMin>=t.min&&f.salaryMax<=t.max));return j(async()=>{i.value=!0;const f=await q("jobs","live","==",!0,["updatedAt","desc"],25);o.value=f.docs,i.value=!1}),(f,a)=>(s(),l("span",ut,[e("div",ft,[pt,e("span",mt,[e("div",vt,[_t,e("div",xt,[y(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":a[0]||(a[0]=c=>t.min=c)},null,512),[[b,t.min]]),ht,y(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":a[1]||(a[1]=c=>t.max=c)},null,512),[[b,t.max]])])])])]),e("div",gt,[p.value.length>0&&!i.value?(s(!0),l(w,{key:0},$(p.value,(c,m)=>(s(),P(ie,{job:c,showButtons:!1,key:m},null,8,["job"]))),128)):i.value?(s(),l("div",yt,[x(G,{isLoading:i.value},null,8,["isLoading"])])):(s(),l("div",wt,$t))])]))}}),Ct={class:"flex flex-row gap-2 relative w-full"},Vt={class:"w-1/6 py-4 px-2 sticky top-24 h-64"},Tt=e("h1",{class:"text-2xl font-bold mb-2 capitalize"},"Filters",-1),Gt={class:"divide-y"},Pt={class:"py-4"},jt=e("p",{class:"text-sm mb-2"},"Salary",-1),St={class:"flex flex-row gap-2 items-center"},At=e("p",null,"-",-1),Lt={class:"p-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full"},Ot={key:1,class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3"},Ut={key:2,class:"h-96 w-full flex items-center justify-center col-span-2 md:col-span-2 lg:col-span-3"},Bt=e("p",{class:"text-xl font-bold"},"No Gigs Found",-1),Mt=[Bt],zt=k({__name:"GigCategoryComponent",setup(n){const o=_([]),i=_(!1),t=U({min:0,max:1e4}),p=T(()=>o.value.filter(f=>{const a=f.milestones.reduce((c,m)=>c+m.price,0);return a>=t.min&&a<=t.max}));return j(async()=>{i.value=!0;const f=await q("gigs","live","==",!0,["updatedAt","desc"],25);o.value=f.docs,i.value=!1}),(f,a)=>(s(),l("span",Ct,[e("div",Vt,[Tt,e("span",Gt,[e("div",Pt,[jt,e("div",St,[y(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":a[0]||(a[0]=c=>t.min=c)},null,512),[[b,t.min]]),At,y(e("input",{type:"number",class:"text-xs border rounded-md p-2 w-1/2","onUpdate:modelValue":a[1]||(a[1]=c=>t.max=c)},null,512),[[b,t.max]])])])])]),e("div",Lt,[p.value.length>0&&!i.value?(s(!0),l(w,{key:0},$(p.value,(c,m)=>(s(),P(de,{gig:c,showButtons:!1,key:m},null,8,["gig"]))),128)):i.value?(s(),l("div",Ot,[x(G,{isLoading:i.value},null,8,["isLoading"])])):(s(),l("div",Ut,Mt))])]))}}),Q=n=>(te("data-v-a1d2ba66"),n=n(),le(),n),It={class:"relative flex items-center justify-center h-64 shadow rounded-md p-4"},Nt=Q(()=>e("div",{id:"banner",class:"absolute top-0 left-0 h-64 w-full bg-cover bg-center rounded-md -z-1 opacity-30"},null,-1)),Ft=Q(()=>e("div",{class:"absolute top-0 left-0 h-64 w-full bg-slate-800/80 rounded-md z-1"},null,-1)),Dt={class:"flex flex-row gap-2 z-[7]"},Rt={key:0,class:"p-6"},Jt={key:1},Et={key:2},Wt={key:3},qt={key:4},Kt=k({__name:"FeedView",setup(n){const o=_(0);return(i,t)=>(s(),l(w,null,[e("div",It,[Nt,Ft,e("span",Dt,[e("h1",{class:A(["text-3xl font-bold hover:underline",o.value==0?"text-cyan-500":""]),onClick:t[0]||(t[0]=()=>o.value=0)},"Producers",2),e("h1",{class:A(["text-3xl font-bold hover:underline",o.value==1?"text-cyan-500":""]),onClick:t[1]||(t[1]=()=>o.value=1)},"Products",2),e("h1",{class:A(["text-3xl font-bold hover:underline",o.value==2?"text-cyan-500":""]),onClick:t[2]||(t[2]=()=>o.value=2)},"Buyers",2),e("h1",{class:A(["text-3xl font-bold hover:underline",o.value==3?"text-cyan-500":""]),onClick:t[3]||(t[3]=()=>o.value=3)},"Jobs",2),e("h1",{class:A(["text-3xl font-bold hover:underline",o.value==4?"text-cyan-500":""]),onClick:t[4]||(t[4]=()=>o.value=4)},"Gigs",2)])]),o.value==0?(s(),l("div",Rt,[x(os)])):g("",!0),o.value==1?(s(),l("div",Jt,[x(Ss)])):g("",!0),o.value==2?(s(),l("div",Et,[x(ct)])):g("",!0),o.value==3?(s(),l("div",Wt,[x(kt)])):g("",!0),o.value==4?(s(),l("div",qt,[x(zt)])):g("",!0)],64))}});const el=oe(Kt,[["__scopeId","data-v-a1d2ba66"]]);export{el as default};
