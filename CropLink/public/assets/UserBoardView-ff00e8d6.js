import{h as y,o as F,N as me,O as $,d as j,P as Y,Q as we,R as ge,S,T as q,U as se,V as _e,W as J,X as Ae,F as M,Y as xe,Z as he,$ as ee,a0 as ne,a1 as W,a2 as B,a3 as V,a4 as ke,a5 as Se,a6 as U,a7 as I,a as N,u as Te,e as m,f as w,k as Q,g as s,p as P,t as h,i as A,l as p,K as z,J as K,x as O,z as R,q as C,A as G,s as le,y as Ce,a8 as oe,C as ae,D as ie,G as ue,H as re,I as de,a9 as ce,L as ve,M as fe}from"./index-3cbe3ae6.js";import{I as Ee}from"./ImageCarousel-ca174611.js";function be(t,f){if(t)return t;let r=f??"button";if(typeof r=="string"&&r.toLowerCase()==="button")return"button"}function Pe(t,f){let r=y(be(t.value.type,t.value.as));return F(()=>{r.value=be(t.value.type,t.value.as)}),me(()=>{var b;r.value||$(f)&&$(f)instanceof HTMLButtonElement&&!((b=$(f))!=null&&b.hasAttribute("type"))&&(r.value="button")}),r}let Le=j({props:{onFocus:{type:Function,required:!0}},setup(t){let f=y(!0);return()=>f.value?Y(ge,{as:"button",type:"button",features:we.Focusable,onFocus(r){r.preventDefault();let b,u=50;function l(){var n;if(u--<=0){b&&cancelAnimationFrame(b);return}if((n=t.onFocus)!=null&&n.call(t)){f.value=!1,cancelAnimationFrame(b);return}b=requestAnimationFrame(l)}b=requestAnimationFrame(l)}}):null}});var Be=(t=>(t[t.Forwards=0]="Forwards",t[t.Backwards=1]="Backwards",t))(Be||{}),Ie=(t=>(t[t.Less=-1]="Less",t[t.Equal=0]="Equal",t[t.Greater=1]="Greater",t))(Ie||{});let ye=Symbol("TabsContext");function X(t){let f=ee(ye,null);if(f===null){let r=new Error(`<${t} /> is missing a parent <TabGroup /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(r,X),r}return f}let te=Symbol("TabsSSRContext"),De=j({name:"TabGroup",emits:{change:t=>!0},props:{as:{type:[Object,String],default:"template"},selectedIndex:{type:[Number],default:null},defaultIndex:{type:[Number],default:0},vertical:{type:[Boolean],default:!1},manual:{type:[Boolean],default:!1}},inheritAttrs:!1,setup(t,{slots:f,attrs:r,emit:b}){var u;let l=y((u=t.selectedIndex)!=null?u:t.defaultIndex),n=y([]),x=y([]),d=S(()=>t.selectedIndex!==null),_=S(()=>d.value?t.selectedIndex:l.value);function c(a){var e;let o=q(g.tabs.value,$),k=q(g.panels.value,$),L=o.filter(E=>{var T;return!((T=$(E))!=null&&T.hasAttribute("disabled"))});if(a<0||a>o.length-1){let E=W(l.value===null?0:Math.sign(a-l.value),{[-1]:()=>1,0:()=>W(Math.sign(a),{[-1]:()=>0,0:()=>0,1:()=>1}),1:()=>0}),T=W(E,{0:()=>o.indexOf(L[0]),1:()=>o.indexOf(L[L.length-1])});T!==-1&&(l.value=T),g.tabs.value=o,g.panels.value=k}else{let E=o.slice(0,a),T=[...o.slice(a),...E].find($e=>L.includes($e));if(!T)return;let Z=(e=o.indexOf(T))!=null?e:g.selectedIndex.value;Z===-1&&(Z=g.selectedIndex.value),l.value=Z,g.tabs.value=o,g.panels.value=k}}let g={selectedIndex:S(()=>{var a,e;return(e=(a=l.value)!=null?a:t.defaultIndex)!=null?e:null}),orientation:S(()=>t.vertical?"vertical":"horizontal"),activation:S(()=>t.manual?"manual":"auto"),tabs:n,panels:x,setSelectedIndex(a){_.value!==a&&b("change",a),d.value||c(a)},registerTab(a){var e;if(n.value.includes(a))return;let o=n.value[l.value];n.value.push(a),n.value=q(n.value,$);let k=(e=n.value.indexOf(o))!=null?e:l.value;k!==-1&&(l.value=k)},unregisterTab(a){let e=n.value.indexOf(a);e!==-1&&n.value.splice(e,1)},registerPanel(a){x.value.includes(a)||(x.value.push(a),x.value=q(x.value,$))},unregisterPanel(a){let e=x.value.indexOf(a);e!==-1&&x.value.splice(e,1)}};se(ye,g);let v=y({tabs:[],panels:[]}),D=y(!1);F(()=>{D.value=!0}),se(te,S(()=>D.value?null:v.value));let i=S(()=>t.selectedIndex);return F(()=>{_e([i],()=>{var a;return c((a=t.selectedIndex)!=null?a:t.defaultIndex)},{immediate:!0})}),me(()=>{if(!d.value||_.value==null||g.tabs.value.length<=0)return;let a=q(g.tabs.value,$);a.some((e,o)=>$(g.tabs.value[o])!==$(e))&&g.setSelectedIndex(a.findIndex(e=>$(e)===$(g.tabs.value[_.value])))}),()=>{let a={selectedIndex:l.value};return Y(M,[n.value.length<=0&&Y(Le,{onFocus:()=>{for(let e of n.value){let o=$(e);if((o==null?void 0:o.tabIndex)===0)return o.focus(),!0}return!1}}),J({theirProps:{...r,...Ae(t,["selectedIndex","defaultIndex","manual","vertical","onChange"])},ourProps:{},slot:a,slots:f,attrs:r,name:"TabGroup"})])}}}),Oe=j({name:"TabList",props:{as:{type:[Object,String],default:"div"}},setup(t,{attrs:f,slots:r}){let b=X("TabList");return()=>{let u={selectedIndex:b.selectedIndex.value},l={role:"tablist","aria-orientation":b.orientation.value};return J({ourProps:l,theirProps:t,slot:u,attrs:f,slots:r,name:"TabList"})}}}),pe=j({name:"Tab",props:{as:{type:[Object,String],default:"button"},disabled:{type:[Boolean],default:!1},id:{type:String,default:()=>`headlessui-tabs-tab-${xe()}`}},setup(t,{attrs:f,slots:r,expose:b}){let u=X("Tab"),l=y(null);b({el:l,$el:l}),F(()=>u.registerTab(l)),he(()=>u.unregisterTab(l));let n=ee(te),x=S(()=>{if(n.value){let e=n.value.tabs.indexOf(t.id);return e===-1?n.value.tabs.push(t.id)-1:e}return-1}),d=S(()=>{let e=u.tabs.value.indexOf(l);return e===-1?x.value:e}),_=S(()=>d.value===u.selectedIndex.value);function c(e){var o;let k=e();if(k===V.Success&&u.activation.value==="auto"){let L=(o=Se(l))==null?void 0:o.activeElement,E=u.tabs.value.findIndex(T=>$(T)===L);E!==-1&&u.setSelectedIndex(E)}return k}function g(e){let o=u.tabs.value.map(k=>$(k)).filter(Boolean);if(e.key===B.Space||e.key===B.Enter){e.preventDefault(),e.stopPropagation(),u.setSelectedIndex(d.value);return}switch(e.key){case B.Home:case B.PageUp:return e.preventDefault(),e.stopPropagation(),c(()=>U(o,I.First));case B.End:case B.PageDown:return e.preventDefault(),e.stopPropagation(),c(()=>U(o,I.Last))}if(c(()=>W(u.orientation.value,{vertical(){return e.key===B.ArrowUp?U(o,I.Previous|I.WrapAround):e.key===B.ArrowDown?U(o,I.Next|I.WrapAround):V.Error},horizontal(){return e.key===B.ArrowLeft?U(o,I.Previous|I.WrapAround):e.key===B.ArrowRight?U(o,I.Next|I.WrapAround):V.Error}}))===V.Success)return e.preventDefault()}let v=y(!1);function D(){var e;v.value||(v.value=!0,!t.disabled&&((e=$(l))==null||e.focus({preventScroll:!0}),u.setSelectedIndex(d.value),ke(()=>{v.value=!1})))}function i(e){e.preventDefault()}let a=Pe(S(()=>({as:t.as,type:f.type})),l);return()=>{var e;let o={selected:_.value},{id:k,...L}=t,E={ref:l,onKeydown:g,onMousedown:i,onClick:D,id:k,role:"tab",type:a.value,"aria-controls":(e=$(u.panels.value[d.value]))==null?void 0:e.id,"aria-selected":_.value,tabIndex:_.value?0:-1,disabled:t.disabled?!0:void 0};return J({ourProps:E,theirProps:L,slot:o,attrs:f,slots:r,name:"Tab"})}}}),H=j({name:"TabPanel",props:{as:{type:[Object,String],default:"div"},static:{type:Boolean,default:!1},unmount:{type:Boolean,default:!0},id:{type:String,default:()=>`headlessui-tabs-panel-${xe()}`},tabIndex:{type:Number,default:0}},setup(t,{attrs:f,slots:r,expose:b}){let u=X("TabPanel"),l=y(null);b({el:l,$el:l}),F(()=>u.registerPanel(l)),he(()=>u.unregisterPanel(l));let n=ee(te),x=S(()=>{if(n.value){let c=n.value.panels.indexOf(t.id);return c===-1?n.value.panels.push(t.id)-1:c}return-1}),d=S(()=>{let c=u.panels.value.indexOf(l);return c===-1?x.value:c}),_=S(()=>d.value===u.selectedIndex.value);return()=>{var c;let g={selected:_.value},{id:v,tabIndex:D,...i}=t,a={ref:l,id:v,role:"tabpanel","aria-labelledby":(c=$(u.tabs.value[d.value]))==null?void 0:c.id,tabIndex:_.value?D:-1};return!_.value&&t.unmount&&!t.static?Y(ge,{as:"span",...a}):J({ourProps:a,theirProps:i,slot:g,attrs:f,slots:r,features:ne.Static|ne.RenderStrategy,visible:_.value,name:"TabPanel"})}}});const Ne={class:"grid grid-flow-col space-x-4"},je={class:"w-full h-48 object-cover rounded-lg"},Re={class:"text-xl font-semibold mb-2"},Ue={class:"text-sm mb-2"},Fe=s("strong",null,"Status:",-1),qe={class:"text-sm mb-2"},Ge=s("strong",null,"Id:",-1),Me={class:"text-sm mb-2"},Ve=s("strong",null,"Variety:",-1),He={class:"text-sm mb-2"},We=s("strong",null,"Yield Tonnage:",-1),Ye={class:"text-sm mb-2"},ze=s("strong",null,"Expected Harvest Date:",-1),Ke={class:"text-sm mb-2"},Je=s("strong",null,"Price:",-1),Qe={class:"text-sm mb-2"},Xe=s("strong",null,"bidding End time:",-1),Ze={class:"flex justify-end mt-2 space-x-4"},et=["onClick"],tt=["onClick"],st=["onClick"],nt=j({__name:"SellerContentComponent",props:{ads:{type:Array,required:!0}},emits:["edit"],setup(t,{emit:f}){const r=N().AD_STATUSES,b=Te(),u=f,l=y(!1),n=async v=>{v&&(l.value=!0,await N().postNewAd(v),l.value=!1)},x=y(""),d=async v=>{v&&(x.value=v,console.log("removeAd",v),await N().removeUserAd(v),x.value="")},_=v=>{v&&u("edit",v)},c=v=>{v&&b.push({name:"ad",params:{adId:v}})},g=v=>{v&&b.push({name:"messaging",params:{adId:v}})};return(v,D)=>(m(),w("span",Ne,[(m(!0),w(M,null,Q(t.ads,(i,a)=>(m(),w("div",{key:a,class:"bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"},[s("div",je,[P(Ee,{images:i.resizedImages},null,8,["images"])]),s("h3",Re,h(i.type),1),s("p",Ue,[Fe,A(" "+h(i.status),1)]),s("p",qe,[Ge,A(" "+h(i.id),1)]),s("p",Me,[Ve,A(" "+h(i.variety),1)]),s("p",He,[We,A(" "+h(i.yieldTonnage),1)]),s("p",Ye,[ze,A(" "+h(p(z)(i.expectedHarvestDate)?p(K)(i.expectedHarvestDate):i.expectedHarvestDate),1)]),s("p",Ke,[Je,A(" "+h(i.price),1)]),s("p",Qe,[Xe,A(" "+h(p(z)(i.biddingEndTime)?p(K)(i.biddingEndTime):i.biddingEndTime),1)]),s("div",Ze,[!i.live&&i.status!=p(r).SOLD?(m(),w("button",{key:0,onClick:e=>_(i.id),class:"inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"}," Edit ",8,et)):O("",!0),!i.live&&i.status==p(r).SOLD?(m(),w("button",{key:1,onClick:e=>g(i.id),class:"inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"}," Contact Winner ",8,tt)):O("",!0),!i.live&&i.status!=p(r).SOLD?(m(),R(G,{key:2,disabled:i.live,isLoading:l.value,onClick:e=>n(i.id),class:"inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"},{default:C(()=>[A(" Post "+h(i.status),1)]),_:2},1032,["disabled","isLoading","onClick"])):O("",!0),s("button",{onClick:e=>c(i.id),class:"inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"}," View ",8,st),!i.live&&i.status!=p(r).SOLD?(m(),R(G,{key:3,disabled:i.live,isLoading:x.value==i.id,onClick:e=>d(i.id),class:"inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"},{default:C(()=>[A(" Remove ")]),_:2},1032,["disabled","isLoading","onClick"])):O("",!0)])]))),128))]))}}),lt={class:"text-xl font-semibold mb-2"},ot={class:"text-sm mb-2"},at=s("strong",null,"Id:",-1),it={class:"text-sm mb-2"},ut=s("strong",null,"Yield Tonnage:",-1),rt={class:"text-sm mb-2"},dt=s("strong",null,"Request Date:",-1),ct={class:"text-sm mb-2"},vt=s("strong",null,"Price:",-1),ft={class:"flex justify-end mt-2 space-x-4"},bt=["onClick"],pt=j({__name:"BuyerContentComponent",props:{ads:{type:Array,required:!0}},emits:["edit"],setup(t,{emit:f}){const r=f,b=y(!1),u=async d=>{d&&(b.value=!0,await N().postNewAd(d),b.value=!1)},l=y(""),n=async d=>{d&&(l.value=d,N().removeUserAd(d),l.value="")},x=d=>{d&&r("edit",d)};return(d,_)=>(m(),w("span",null,[(m(!0),w(M,null,Q(t.ads,(c,g)=>(m(),w("div",{key:g,class:"bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"},[s("h3",lt,h(c.type),1),s("p",ot,[at,A(" "+h(c.id),1)]),s("p",it,[ut,A(" "+h(c.yieldTonnage),1)]),s("p",rt,[dt,A(" "+h(c.requestDate),1)]),s("p",ct,[vt,A(" "+h(c.price),1)]),s("div",ft,[s("button",{onClick:v=>x(c.id),class:"inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"}," Edit ",8,bt),P(G,{isLoading:b.value,disabled:c.live,onClick:v=>u(c.id),class:"inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"},{default:C(()=>[A(" Post ")]),_:2},1032,["isLoading","disabled","onClick"]),P(G,{isLoading:l.value==c.id,disabled:!c.live,onClick:v=>n(c.id),class:"inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"},{default:C(()=>[A(" Remove ")]),_:2},1032,["isLoading","disabled","onClick"])])]))),128))]))}}),mt={class:"grid grid-flow-row space-y-4"},gt={class:"bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 mb-4"},_t={class:"flex flex-row"},xt={class:"flex flex-row space-x-4"},ht=s("label",{class:"block text-sm font-medium text-gray-700"},"Buyer",-1),yt={class:"text-sm"},$t={class:"flex flex-row space-x-4"},wt=s("label",{class:"block text-sm font-medium text-gray-700"},"Offer",-1),At={class:"text-sm"},kt={class:"flex flex-row space-x-4"},St=s("label",{class:"block text-sm font-medium text-gray-700"},"Time",-1),Tt={class:"text-sm"},Ct={class:"flex flex-row space-x-4"},Et=s("label",{class:"block text-sm font-medium text-gray-700"},"Status",-1),Pt={class:"text-sm"},Lt={class:"flex flex-row space-x-4"},Bt=s("label",{class:"block text-sm font-medium text-gray-700"},"Last updated",-1),It={class:"text-sm"},Dt={class:"flex justify-end"},Ot=j({__name:"BidContentComponent",props:{bids:{type:Array,required:!0}},setup(t){const f=N().BID_STATUSES,r=y(""),b=async u=>{console.log("Cancelling bid",u),r.value=u,await N().cancelUserBid(u),r.value=""};return(u,l)=>(m(),w("span",mt,[(m(!0),w(M,null,Q(t.bids,n=>(m(),w("div",gt,[s("div",_t,[s("span",null,[s("div",xt,[ht,s("p",yt,h(n.buyerId.substring(0,5)),1)]),s("div",$t,[wt,s("p",At,h(n.price),1)]),s("div",kt,[St,s("p",Tt,h(p(z)(n.createdAt)?p(K)(n.createdAt):n.createdAt),1)])]),s("span",null,[s("div",Ct,[Et,s("p",Pt,h(n.status),1)]),s("div",Lt,[Bt,s("p",It,h(p(z)(n.updatedAt)?p(K)(n.updatedAt):n.updatedAt),1)])])]),s("div",Dt,[n.status===p(f).PENDING?(m(),R(G,{key:0,isLoading:r.value==n.id,onClick:x=>b(n.id),class:"mt-2 mb-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"},{default:C(()=>[A("Cancel Bid")]),_:2},1032,["isLoading","onClick"])):O("",!0)])]))),256))]))}}),Nt={class:"w-full px-2 py-3 sm:px-0"},jt={key:0,class:"w-full"},Rt={key:0,class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"},Ut={key:1},Ft={key:2},qt=s("div",null,"No ads found",-1),Gt=[qt],Mt={key:1},Vt={key:2},Ht=s("p",null,"No bids yet",-1),Wt=[Ht],Kt=j({__name:"UserBoardView",setup(t){const{profile:f,user:r}=le(N()),{modals:b}=le(Ce()),u=N().ACCOUNT_TYPES,l=()=>{b.value.addad=!0},n=y(0),x={ADS:"Ads",CONTRACTS:"Contracts",MESSAGES:"Messages"},d=y([]),_=y([]),c=y(!1),g=async()=>{c.value=!0,d.value=await oe("ads","uid","==",r.value.uid,["createdAt","desc"],10),console.log("ads",d.value),i=ae(ie(de(fe,"ads"),re("uid","==",r.value.uid),ue("createdAt","desc")),e=>{d.value.docs=e.docs.map(o=>(console.log("ads changed"),{id:o.id,...o.data()}))}),c.value=!1},v=y(!1),D=async()=>{v.value=!0,_.value=await oe("bids","buyerId","==",r.value.uid,["createdAt","desc"],10),console.log("loadingBids",_.value),i=ae(ie(de(fe,"bids"),re("buyerId","==",r.value.uid),ue("createdAt","desc")),e=>{_.value.docs=e.docs.map(o=>(console.log("bids changed"),{id:o.id,...o.data()}))}),v.value=!1};let i;_e(n,async(e,o)=>{n.value==0&&await g(),n.value==3&&await D(),(o==3||o==0)&&i()}),F(async()=>{console.log("mounted"),await g()});const a=async e=>{console.log("removeAd",e),b.value.editad=!0,b.value.context=d.value.docs.find(o=>o.id===e)};return(e,o)=>(m(),w("div",Nt,[p(f)?(m(),w("div",jt,[P(p(De),{class:"w-full",as:"div"},{default:C(()=>[P(p(Oe),{class:"w-full flex space-x-1 rounded-xl bg-blue-900/20 p-1"},{default:C(()=>[(m(),w(M,null,Q(x,(k,L,E)=>P(p(pe),{as:"template",key:L,onClick:T=>n.value=E},{default:C(({selected:T})=>[s("button",{class:ce(["w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700","ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",T?"bg-white shadow":"text-blue-100 hover:bg-white/[0.12] hover:text-white"])},h(k),3)]),_:2},1032,["onClick"])),64)),p(f).accountType===p(u).BUYER?(m(),R(p(pe),{key:0,as:"template",onClick:o[0]||(o[0]=k=>n.value=3)},{default:C(({selected:k})=>[s("button",{class:ce(["w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700","ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",k?"bg-white shadow":"text-blue-100 hover:bg-white/[0.12] hover:text-white"])}," Bids ",2)]),_:1})):O("",!0)]),_:1}),P(p(H),null,{default:C(()=>[s("button",{onClick:l,class:"mt-2 mb-2 w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"},"Add an ad"),d.value.docs&&d.value.docs.length>0&&!c.value?(m(),w("div",Rt,[p(f).accountType==p(u).SELLER?(m(),R(nt,{key:0,ads:d.value.docs?d.value.docs:[],onEdit:a},null,8,["ads"])):O("",!0),p(f).accountType==p(u).BUYER?(m(),R(pt,{key:1,ads:d.value.docs?d.value.docs:[],onEdit:a},null,8,["ads"])):O("",!0)])):c.value?(m(),w("div",Ut,[P(ve,{isLoading:c.value},null,8,["isLoading"])])):(m(),w("div",Ft,Gt))]),_:1}),P(p(H),null,{default:C(()=>[A(" Contract ")]),_:1}),P(p(H),null,{default:C(()=>[A(" Messages ")]),_:1}),P(p(H),null,{default:C(()=>[_.value.docs&&_.value.docs.length>0&&!v.value?(m(),R(Ot,{key:0,bids:_.value.docs?_.value.docs:[]},null,8,["bids"])):v.value?(m(),w("div",Mt,[P(ve,{isLoading:v.value},null,8,["isLoading"])])):(m(),w("span",Vt,Wt))]),_:1})]),_:1})])):O("",!0)]))}});export{Kt as default};