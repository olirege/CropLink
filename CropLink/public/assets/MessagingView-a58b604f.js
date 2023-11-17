import{e as s,f as o,g as t,d as se,s as le,a as Q,u as ve,h as _,o as de,c as re,y as n,F as Z,k as ee,l as M,L as J,p as g,t as p,w as ie,v as ue,af as fe,z as G,N as H,O as te,ag as y,B as C,i as ce,ae as B,ah as he,ai as me,X as _e,aj as ge,P as z,q as K,m as pe,n as xe,ak as F,A as S,al as ne,am as ye,an as Ce,ao as we,ad as be,R as $e,ap as ke}from"./index-990be236.js";function Ie(x,b){return s(),o("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})])}function Me(x,b){return s(),o("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"})])}function Ee(x,b){return s(),o("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},[t("path",{"fill-rule":"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z","clip-rule":"evenodd"})])}function Le(x,b){return s(),o("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},[t("path",{"fill-rule":"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z","clip-rule":"evenodd"})])}const Re={key:0,class:"p-4 w-full mx-auto bg-white rounded-lg shadow-md flex flex-col space-y-4"},Te=t("h1",{class:"text-xl font-semibold border-b pb-2"},"Messaging",-1),De={key:0,class:"flex flex-col space-y-2 overflow-y-auto h-full"},Ae={class:"break-words"},Se={key:0,class:"flex justify-between mb-2"},Ne={class:"text-sm font-medium"},Pe={class:"text-sm font-medium"},Oe={class:"flex flex-col space-y-1"},je={key:0,class:"truncate bg-gray-100 rounded-md p-2 max-w-xs md:max-w-md text-xs rounded-md p-1 bg-slate-200"},Ue=t("span",{class:"font-bold"},"clause:",-1),qe={class:"italic"},Be={key:1,class:"flex justify-center items-center h-32"},Ve=t("p",{class:"text-gray-500"},"No messages yet",-1),ze=[Ve],Fe={key:2,class:"flex justify-center items-center h-32"},Ge={class:"flex items-end space-x-2"},He={class:"border rounded-md w-full p-2"},Je={key:0,class:"relative w-full truncate bg-gray-100 rounded-md p-2 max-w-xs md:max-w-md text-xs rounded-md p-1 bg-slate-200"},We={class:"text-sm text-slate-500 truncate"},Xe=t("span",{class:"font-bold"},"clause: ",-1),Ye={class:"italic"},Ke={class:"h-full flex items-start"},Qe={key:1,class:"flex justify-center items-center h-32"},Ze=t("p",{class:"text-gray-500"},"No chatroom found",-1),et=[Ze],tt={key:2},st=se({__name:"ChatRoomComponent",props:{clauseMentionned:{type:Object,default:{}},adId:{type:String,required:!0}},emits:["onRemoveMentionnedClause"],setup(x,{emit:b}){const I=b,c=x,{user:i,profile:u}=le(Q()),O=ve(),E="chatrooms",$="messages",e=_(!1),w=_(!1),k=_({}),v=_({}),d=_([]);let T;const j=async()=>{e.value=!0;const f=(await fe(E,"adId","==",c.adId))[0];if(!f)throw new Error("Chatroom not found");k.value={...f},e.value=!1,T=G(H(y(C,`${E}/${f.id}/${$}`),te("createdAt","asc")),r=>{w.value=!0,d.value=r.docs.map(D=>({...D.data()})),w.value=!1})};de(async()=>{try{await j()}catch(m){m.message=="Chatroom not found"&&O.push("/")}}),re(()=>{T&&T()});const N=_(!1),W=async()=>{if(N.value=!0,!k.value||!v.value.text||!i.value||!u.value)return;const m=y(C,E,k.value.id,$);v.value.quote=c.clauseMentionned,v.value.createdAt=new Date,v.value.senderId=i.value.uid,await me(m,v.value),v.value.text="",I("onRemoveMentionnedClause"),N.value=!1},X=m=>{const f=new Date,r=m.toDate(),D=f.getTime()-r.getTime(),U=Math.floor(D/1e3),q=Math.floor(U/60),A=Math.floor(q/60),V=Math.floor(A/24);return V>0?`${V} days ago`:A>0?`${A} hours ago`:q>0?`${q} minutes ago`:U>0?`${U} seconds ago`:"just now"},Y=m=>{if(m===0)return!0;const f=d.value[m-1],r=d.value[m];return f.senderId!==r.senderId};return(m,f)=>k.value.id&&!e.value&&n(i)&&n(u)?(s(),o("div",Re,[Te,d.value.length>0&&!w.value?(s(),o("div",De,[(s(!0),o(Z,null,ee(d.value,(r,D)=>(s(),o("span",Ae,[Y(D)?(s(),o("div",Se,[t("p",Ne,p(r.senderId.substring(0,5))+" says:",1),t("p",Pe,p(X(r.createdAt)),1)])):g("",!0),t("div",{class:B([r.senderId!=n(i).uid?"justify-end":"justify-start","flex"])},[t("div",Oe,[r.quote&&r.quote.text?(s(),o("p",je,[Ue,ce(),t("span",qe,p(r.quote.text),1)])):g("",!0),t("p",{class:B([r.senderId===n(i).uid?"bg-blue-500 text-white":"bg-gray-100","rounded-md p-2 max-w-xs md:max-w-md",r.quote?"ml-2":""])},p(r.text),3)])],2)]))),256))])):d.value.length==0&&!w.value?(s(),o("div",Be,ze)):w.value?(s(),o("div",Fe,[M(J,{isLoading:w.value},null,8,["isLoading"])])):g("",!0),t("span",Ge,[t("div",He,[x.clauseMentionned.id?(s(),o("div",Je,[M(n(Le),{class:"h-4 w-4 absolute top-1 right-1",onClick:f[0]||(f[0]=r=>m.$emit("onRemoveMentionnedClause"))}),t("p",We,[Xe,t("span",Ye,p(x.clauseMentionned.text),1)])])):g("",!0),ie(t("textarea",{"onUpdate:modelValue":f[1]||(f[1]=r=>v.value.text=r),class:"h-full w-full resize-none focus:outline-none",placeholder:"Type your message here..."},null,512),[[ue,v.value.text]])]),t("div",Ke,[M(n(he),{onClick:W,class:"h-6 w-6 text-blue-500"})])])])):!k.value.id&&!e.value?(s(),o("div",Qe,et)):(s(),o("div",tt,[M(J,{isLoading:e.value},null,8,["isLoading"])]))}}),at={key:0,class:"p-4 w-full mx-auto bg-white rounded-lg shadow-md flex flex-col space-y-4"},ot=t("h1",{class:"text-xl font-semibold border-b pb-2"},"Contract Draft",-1),nt={key:0,class:"flex flex-col space-y-4"},lt={key:0},dt={class:"text-lg font-semibold border-b pb-2"},rt={class:"flex flex-col space-y-2"},it={class:"relative break-words"},ut=["onUpdate:modelValue"],ct={key:2,class:"w-full flex justify-between"},vt=["onClick"],ft={class:"flex items-center space-x-1 absolute top-1 right-1"},ht={key:0},mt={class:"text-lg font-semibold border-b pb-2"},_t={class:"flex flex-col space-y-2"},gt={class:"relative break-words"},pt={class:"w-full flex justify-between"},xt=["onClick"],yt={class:"flex space-x-2"},Ct=["onClick"],wt=["onClick"],bt={class:"w-full flex justify-between"},$t={key:0,class:"text-xs"},kt={key:1,class:"text-xs"},It={key:1},Mt={key:1},Et=t("p",null,"No Contract Found",-1),Lt=[Et],Rt={key:2},Tt=se({__name:"ContractComponent",props:{adId:{type:String,required:!0}},emits:["onMentionClause"],setup(x,{emit:b}){const I=x,c="contracts",i="clauses",{user:u,profile:O}=le(Q()),E=_(!1),$=_(!1),e=_({}),w=_([]),k=_([]),v=_({}),d=Q().CLAUSE_STATUSES;let T,j,N;const W=_e(e,(a,h)=>{a.id&&(j=G(H(y(C,`${c}/${e.value.id}/${i}`),z("authorId","==",u.value.uid),te("createdAt","asc")),L=>{$.value=!0,console.log("user clauses changed"),w.value=L.docs.map(P=>({...P.data()})),$.value=!1}),N=G(H(y(C,`${c}/${e.value.id}/${i}`),z("authorId","!=",u.value.uid),z("draft","==",!1)),L=>{$.value=!0,console.log("other clauses changed"),k.value=L.docs.map(P=>({...P.data()})),$.value=!1}))}),X=async()=>{const a=y(C,`${c}/${e.value.id}/${i}`),h={id:Math.random().toString(36).substring(7),text:"",draft:!0,state:d.PENDING,authorId:u.value.uid,createdAt:new Date,updatedAt:new Date};console.log("onAddClauseDraft",a,h.id),await F(S(a,h.id),h)},Y=async a=>{if(console.log("onRemoveClause",a),!a||!e.value.id)return;const h=y(C,`${c}/${e.value.id}/${i}`);await ke(S(h,a)),v.value.id==a&&(v.value={})},m=async a=>{if(console.log("onEditClause",a),!a||!e.value.id)return;const h=y(C,`${c}/${e.value.id}/${i}`);await F(S(h,a),{draft:!0},{merge:!0}),v.value.id==a&&(v.value={})},f=async(a,h)=>{if(console.log("onEditClause",a,h),!a||!e.value.id||!Object.values(d).includes(h))return;const L=y(C,`${c}/${e.value.id}/${i}`);await F(S(L,a),{state:h},{merge:!0}),v.value.id==a&&(v.value={})},r=async a=>{if(console.log("onEditClause",a),!a||!e.value.id)return;a.draft=!1;const h=y(C,`${c}/${e.value.id}/${i}`);await F(S(h,a.id),a,{merge:!0})},D=async()=>{if(console.log(e.value),!e.value.id||!u.value.uid||e.value&&e.value.ready&&e.value.ready.includes(u.value.uid))return;console.log("onReadyToProceed",e.value.id,u.value.uid);const a=y(C,c);await ne(S(a,e.value.id),{ready:ye(u.value.uid)})},U=async()=>{if(!e.value.id||!u.value.uid||e.value&&e.value.ready&&!e.value.ready.includes(u.value.uid))return;console.log("onCancelReadyToProceed",e.value.id,u.value.uid);const a=y(C,c);await ne(S(a,e.value.id),{ready:Ce(u.value.uid)})},q=ge(),A=_(!1),V=async()=>{if(!I.adId)return;console.log("onProceed",I.adId,e.value.id),A.value=!0;const a=await q({adId:I.adId,contractId:e.value.id});A.value=!1,a&&a.data.landingPage&&we.push({name:"banking",params:{adId:I.adId,contractId:e.value.id}})};return de(async()=>{T=G(H(y(C,c),z("adId","==",I.adId),te("createdAt","asc")),a=>{E.value=!0,console.log("contract changed"),e.value=a.docs[0].data(),E.value=!1})}),re(()=>{T&&T(),j&&j(),N&&N(),W()}),(a,h)=>{var L,P,ae,oe;return e.value.id&&!E.value?(s(),o("div",at,[ot,t("div",null,[t("p",null,"Last Updated: "+p(n(be)(e.value.updatedAt)?n($e)(e.value.updatedAt):e.value.updatedAt),1)]),t("button",{onClick:X,class:"w-full border-dashed border-2 border-sky-500 rounded-sm p-1"},"Add Clause"),$.value?(s(),o("div",It,[M(J,{isLoading:$.value},null,8,["isLoading"])])):(s(),o("div",nt,[t("span",null,[w.value&&w.value.length>0?(s(),o("span",lt,[t("label",dt,p(n(O)&&n(O).name?`${n(O).name}'s `:"Your ")+"clauses",1),t("span",rt,[(s(!0),o(Z,null,ee(w.value,l=>(s(),o("div",it,[l.draft?ie((s(),o("textarea",{key:0,class:"w-full p-2 border rounded-md resize-none focus:border-blue-500 focus:ring-0","onUpdate:modelValue":R=>l.text=R},null,8,ut)),[[ue,l.text]]):(s(),o("p",{key:1,class:B(["w-full p-2 border rounded-md",{"bg-gray-200":l.state==n(d).PENDING,"bg-green-200":l.state==n(d).ACCEPTED,"bg-red-200":l.state==n(d).REJECTED}])},p(l.text),3)),l.state!=n(d).PENDING?(s(),o("div",ct,[l.draft?g("",!0):(s(),o("p",{key:0,class:"text-xs underline",onClick:R=>a.$emit("onMentionClause",l)},"Mention",8,vt)),t("p",{class:B({"text-green-400 text-xs":l.state==n(d).ACCEPTED,"text-red-400 text-xs":l.state==n(d).REJECTED})},p(l.state),3)])):g("",!0),t("div",ft,[l.draft?(s(),K(n(Ee),{key:0,class:"h-5 w-5 text-green-400",onClick:R=>r(l)},null,8,["onClick"])):(s(),K(n(Ie),{key:1,class:"h-5 w-5 text-blue-400",onClick:R=>m(l.id)},null,8,["onClick"])),M(n(Me),{class:"h-5 w-5",onClick:R=>Y(l.id)},null,8,["onClick"])])]))),256))])])):g("",!0)]),t("span",null,[k.value&&k.value.length>0?(s(),o("span",ht,[t("label",mt,p(n(u).name==e.value.sellerId?e.value.sellerId.substring(0,5):e.value.buyerId.substring(0,5))+"'s clauses",1),t("span",_t,[(s(!0),o(Z,null,ee(k.value,l=>(s(),o("div",gt,[t("p",{class:B(["w-full p-2 border rounded-md",{"bg-gray-200":l.state==n(d).PENDING,"bg-green-200":l.state==n(d).ACCEPTED,"bg-red-200":l.state==n(d).REJECTED}])},p(l.text),3),t("div",pt,[t("a",{class:"text-xs underline",onClick:R=>a.$emit("onMentionClause",l)},"Mention",8,xt),t("div",yt,[t("a",{class:"text-xs font-semibold text-green-400 underline decoration-green-400",onClick:R=>f(l.id,n(d).ACCEPTED)},"Approve",8,Ct),t("a",{class:"text-xs font-semibold text-red-400 underline decoration-red-400",onClick:R=>f(l.id,n(d).REJECTED)},"Reject",8,wt)])])]))),256))])])):g("",!0)]),t("div",bt,[t("div",null,[(L=e.value.ready)!=null&&L.includes(e.value.sellerId)?(s(),o("p",$t,p(e.value.sellerId.substring(0,5))+" is ready",1)):g("",!0),(P=e.value.ready)!=null&&P.includes(e.value.buyerId)?(s(),o("p",kt,p(e.value.buyerId.substring(0,5))+" is ready",1)):g("",!0)]),e.value.ready.includes(n(u).uid)?g("",!0):(s(),o("button",{key:0,onClick:D,class:"bg-blue-500 text-white px-4 h-8 rounded-md hover:bg-blue-400 transition duration-300 ease-in-out"},"Ready to Proceed ")),e.value.ready.includes(n(u).uid)?(s(),o("button",{key:1,onClick:U,class:"bg-red-500 text-white px-4 h-8 rounded-md hover:bg-red-400 transition duration-300 ease-in-out"},"Cancel ")):g("",!0)]),(ae=e.value.ready)!=null&&ae.includes(e.value.sellerId)&&((oe=e.value.ready)!=null&&oe.includes(e.value.buyerId))?(s(),K(xe,{key:0,onClick:V,isLoading:A.value},{default:pe(()=>[ce("Proceed ")]),_:1},8,["isLoading"])):g("",!0)]))])):!e.value.id&&!E.value?(s(),o("div",Mt,Lt)):(s(),o("div",Rt,[M(J,{isLoading:$.value},null,8,["isLoading"])]))}}}),Dt={class:"grid grid-cols-2 gap-x-4 p-2"},St=se({__name:"MessagingView",props:{adId:{type:String,required:!1},contractId:{type:String,required:!1}},setup(x){const b=_({}),I=i=>{!i||!i.id||i.draft||(b.value=i)},c=()=>{b.value={}};return(i,u)=>(s(),o("div",Dt,[M(st,{clauseMentionned:b.value,onOnRemoveMentionnedClause:c,adId:x.adId},null,8,["clauseMentionned","adId"]),M(Tt,{adId:x.adId,onOnMentionClause:I},null,8,["adId"])]))}});export{St as default};
