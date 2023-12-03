import{e as a,f as o,j as t,d as oe,s as W,m as K,a as ae,u as ce,r as b,o as le,c as re,B as l,F,l as Q,n as w,L as X,z as x,t as g,w as ie,v as de,i as ue,W as U,I as ve,aE as fe,aF as q,aG as S,aH as A,aI as ge,N as _e,aJ as he,A as se,p as pe,x as me,aK as Y,aL as j,aM as ne,aN as xe,aO as be,y as ye,a0 as Ce,a2 as we,aP as $e,a1 as ke,aQ as Ie,aR as Ee}from"./index-9479e00e.js";import{r as Re}from"./CheckCircleIcon-8b3224ab.js";function Te(R,D){return a(),o("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor","aria-hidden":"true"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"})])}const Me={key:0,class:"p-4 w-full mx-auto bg-white rounded-lg shadow-md flex flex-col space-y-4 h-full"},Se=t("h1",{class:"text-xl font-semibold border-b pb-2"},"Messaging",-1),Ae={key:0,class:"flex flex-col space-y-2 overflow-y-auto h-[500px]"},De={class:"break-words"},Le={key:0,class:"flex justify-between mb-2"},Ne={class:"text-sm font-medium"},Oe={class:"text-sm font-medium"},Pe={class:"flex flex-col space-y-1"},je={key:0,class:"truncate bg-gray-100 rounded-md p-2 max-w-xs md:max-w-md text-xs rounded-md p-1 bg-slate-200"},Ue=t("span",{class:"font-bold"},"clause:",-1),Fe={class:"italic"},Ve={key:1,class:"flex justify-center items-center h-32 flex-grow"},qe=t("p",{class:"text-gray-500"},"No messages yet",-1),Be=[qe],ze={key:2,class:"flex justify-center items-center h-32 flex-grow"},Ge={class:"flex items-end space-x-2"},He={class:"border rounded-md w-full p-2"},Je={key:0,class:"relative w-full truncate bg-gray-100 rounded-md p-2 max-w-xs md:max-w-md text-xs rounded-md p-1 bg-slate-200"},Ye={class:"text-sm text-slate-500 truncate"},Qe=t("span",{class:"font-bold"},"clause: ",-1),We={class:"italic"},Ke={class:"h-full flex items-start"},Xe={key:1,class:"flex justify-center items-center h-32"},Ze=t("p",{class:"text-gray-500"},"No chatroom found",-1),et=[Ze],tt={key:2},st=oe({__name:"ChatRoomComponent",props:{clauseMentionned:{type:Object,default:{}},adId:{type:String,required:!0}},emits:["onRemoveMentionnedClause"],setup(R,{emit:D}){const{notifications:i}=W(K()),$=K().NOTIFICATION_TYPES,y=D,_=R,{user:d,profile:r}=W(ae()),L=ce(),N="chatrooms",M="messages",e=b(!1),k=b(!1),C=b({}),h=b({}),v=b([]);let O;const V=async()=>{const f=[["createdAt","asc"]],p=[],u=`${N}/${C.value.id}/${M}`,{subscribe:I,unsubscribe:T}=q(u,p,f,s=>{v.value=s},s=>{i.value.show=!0,i.value.type=$.ERROR,i.value.message="Error loading messages, please try again later"},k);O=T,I()};let P;const Z=async()=>{const f=N,p=[["adId","==",_.adId]],u=["createdAt","desc"],{subscribe:I,unsubscribe:T}=q(f,p,u,s=>{s.length>0&&(C.value=s[0],V())},s=>{i.value.show=!0,i.value.type=$.ERROR,i.value.message="Error loading chatroom, please try again later"},e);P=T,I()};le(async()=>{try{await Z()}catch(f){f.message=="Chatroom not found"&&L.push("/")}}),re(()=>{O&&O(),P&&P()});const B=b(!1),ee=async()=>{if(B.value=!0,!C.value||!h.value.text||!d.value||!r.value)return;const f=S(A,N,C.value.id,M);h.value.quote=_.clauseMentionned,h.value.createdAt=new Date,h.value.senderId=d.value.uid,await ge(f,h.value),h.value.text="",y("onRemoveMentionnedClause"),B.value=!1},te=f=>{const p=new Date,u=f.toDate(),I=p.getTime()-u.getTime(),T=Math.floor(I/1e3),s=Math.floor(T/60),c=Math.floor(s/60),m=Math.floor(c/24);return m>0?`${m} days ago`:c>0?`${c} hours ago`:s>0?`${s} minutes ago`:T>0?`${T} seconds ago`:"just now"},z=f=>{if(f===0)return!0;const p=v.value[f-1],u=v.value[f];return p.senderId!==u.senderId||p.createdAt.toDate().getHours()!==u.createdAt.toDate().getHours()};return(f,p)=>C.value.id&&!e.value&&l(d)&&l(r)?(a(),o("div",Me,[Se,v.value.length>0&&!k.value?(a(),o("div",Ae,[(a(!0),o(F,null,Q(v.value,(u,I)=>(a(),o("span",De,[z(I)?(a(),o("div",Le,[t("p",Ne,g(u.senderId.substring(0,5))+" says:",1),t("p",Oe,g(te(u.createdAt)),1)])):x("",!0),t("div",{class:U([u.senderId!=l(d).uid?"justify-end":"justify-start","flex"])},[t("div",Pe,[u.quote&&u.quote.text?(a(),o("p",je,[Ue,ue(),t("span",Fe,g(u.quote.text),1)])):x("",!0),t("p",{class:U([u.senderId===l(d).uid?"bg-blue-500 text-white":"bg-gray-100","rounded-md p-2 max-w-xs md:max-w-md",u.quote?"ml-2":""])},g(u.text),3)])],2)]))),256))])):v.value.length==0&&!k.value?(a(),o("div",Ve,Be)):k.value?(a(),o("div",ze,[w(X,{isLoading:k.value},null,8,["isLoading"])])):x("",!0),t("span",Ge,[t("div",He,[R.clauseMentionned.id?(a(),o("div",Je,[w(l(ve),{class:"h-4 w-4 absolute top-1 right-1",onClick:p[0]||(p[0]=u=>f.$emit("onRemoveMentionnedClause"))}),t("p",Ye,[Qe,t("span",We,g(R.clauseMentionned.text),1)])])):x("",!0),ie(t("textarea",{"onUpdate:modelValue":p[1]||(p[1]=u=>h.value.text=u),class:"h-full w-full resize-none focus:outline-none",placeholder:"Type your message here..."},null,512),[[de,h.value.text]])]),t("div",Ke,[w(l(fe),{onClick:ee,class:"h-6 w-6 text-blue-500"})])])])):!C.value.id&&!e.value?(a(),o("div",Xe,et)):(a(),o("div",tt,[w(X,{isLoading:e.value},null,8,["isLoading"])]))}}),at={key:0,class:"p-4 w-full mx-auto bg-white rounded-lg shadow-md flex flex-col space-y-4"},ot=t("h1",{class:"text-xl font-semibold border-b pb-2"},"Contract Draft",-1),nt={key:0},lt={class:"grid"},rt={class:"flex flex-col"},it=t("label",{class:"text-lg font-semibold border-b pb-2"},"Milestones:",-1),dt={class:"w-full p-2 border rounded-md resize-none focus:border-blue-500 focus:ring-0 flex flex-col gap-2"},ut={class:"flex flex-row justify-between"},ct={class:"flex flex-row items-center gap-2"},vt={class:"font-bold text-xl"},ft={class:"italic text-xl"},gt={class:"flex flex-row gap-4"},_t={key:1,class:"flex flex-col space-y-4"},ht={key:0},pt={class:"text-lg font-semibold border-b pb-2"},mt={class:"flex flex-col space-y-2"},xt={class:"relative break-words"},bt=["onUpdate:modelValue"],yt={key:2,class:"w-full flex justify-between"},Ct=["onClick"],wt={class:"flex items-center space-x-1 absolute top-1 right-1"},$t={key:0},kt={class:"text-lg font-semibold border-b pb-2"},It={class:"flex flex-col space-y-2"},Et={class:"relative break-words"},Rt={class:"w-full flex justify-between"},Tt=["onClick"],Mt={class:"flex space-x-2"},St=["onClick"],At=["onClick"],Dt={class:"w-full flex justify-between"},Lt={key:0,class:"text-xs"},Nt={key:1,class:"text-xs"},Ot={key:2},Pt={key:1},jt=t("p",null,"No Contract Found",-1),Ut=[jt],Ft={key:2},Vt=oe({__name:"ContractComponent",props:{adId:{type:String,required:!0}},emits:["onMentionClause"],setup(R,{emit:D}){const{notifications:i}=W(K()),$=K().NOTIFICATION_TYPES,y=R,_="contracts",d="clauses",{user:r,profile:L}=W(ae()),N=b(!1),M=b(!1),e=b({}),k=b([]),C=b([]),h=b({}),v=ae().CLAUSE_STATUSES;let O,V,P;const Z=_e(e,async(s,c)=>{if(s.id){const{subscribe:m,unsubscribe:G}=q(`${_}/${e.value.id}/${d}`,[["authorId","==",r.value.uid]],["createdAt","asc"],n=>{k.value=n},n=>{i.value.show=!0,i.value.type=$.ERROR,i.value.message="Error loading clauses, please try again later"},M);V=G,m();const{subscribe:H,unsubscribe:J}=q(`${_}/${e.value.id}/${d}`,[["authorId","!=",r.value.uid],["draft","==",!1]],[],n=>{C.value=n},n=>{i.value.show=!0,i.value.type=$.ERROR,i.value.message="Error loading clauses, please try again later"},M);P=J,H()}}),B=async()=>{const s=S(A,`${_}/${e.value.id}/${d}`),c={id:Math.random().toString(36).substring(7),text:"",draft:!0,state:v.PENDING,authorId:r.value.uid,createdAt:new Date,updatedAt:new Date};console.log("onAddClauseDraft",s,c.id),await Y(j(s,c.id),c)},ee=async s=>{if(console.log("onRemoveClause",s),!s||!e.value.id)return;const c=S(A,`${_}/${e.value.id}/${d}`);await Ie(j(c,s)),h.value.id==s&&(h.value={})},te=async s=>{if(console.log("onEditClause",s),!s||!e.value.id)return;const c=S(A,`${_}/${e.value.id}/${d}`);await Y(j(c,s),{draft:!0},{merge:!0}),h.value.id==s&&(h.value={})},z=async(s,c)=>{if(console.log("onEditClause",s,c),!s||!e.value.id||!Object.values(v).includes(c))return;const m=S(A,`${_}/${e.value.id}/${d}`);await Y(j(m,s),{state:c},{merge:!0}),h.value.id==s&&(h.value={})},f=async s=>{if(console.log("onEditClause",s),!s||!e.value.id)return;s.draft=!1;const c=S(A,`${_}/${e.value.id}/${d}`);await Y(j(c,s.id),s,{merge:!0})},p=async()=>{if(console.log(e.value),!e.value.id||!r.value.uid||e.value&&e.value.ready&&e.value.ready.includes(r.value.uid))return;console.log("onReadyToProceed",e.value.id,r.value.uid);const s=S(A,_);await ne(j(s,e.value.id),{ready:xe(r.value.uid)})},u=async()=>{if(!e.value.id||!r.value.uid||e.value&&e.value.ready&&!e.value.ready.includes(r.value.uid))return;console.log("onCancelReadyToProceed",e.value.id,r.value.uid);const s=S(A,_);await ne(j(s,e.value.id),{ready:be(r.value.uid)})},I=b(!1),T=async()=>{if(!y.adId)return;console.log("onProceed",y.adId,e.value.id);let s;const{callFunction:c}=ye("createTransaction",{adId:y.adId,contractId:e.value.id},I,void 0,m=>{s=m},()=>{i.value.show=!0,i.value.type=$.SUCCESS,i.value.message="Contract created successfully"},m=>{i.value.show=!0,i.value.type=$.ERROR,i.value.message="Error while creating contract, please try again later"});await c(),s&&s.data.landingPage&&Ee.push({name:"banking",params:{adId:y.adId,contractId:e.value.id}})};return le(async()=>{const{subscribe:s,unsubscribe:c}=q(_,[["adId","==",y.adId]],["createdAt","asc"],m=>{e.value=m[0]},m=>{i.value.show=!0,i.value.type=$.ERROR,i.value.message="Error loading contract, please try again later"},N);O=c,s()}),re(()=>{O&&O(),V&&V(),P&&P(),Z()}),(s,c)=>{var m,G,H,J;return e.value.id&&!N.value?(a(),o("div",at,[ot,t("div",null,[t("p",null,"Last Updated: "+g(l(Ce)(e.value.updatedAt)?l(we)(e.value.updatedAt):e.value.updatedAt),1)]),e.value.context?(a(),o("div",nt,[e.value.type=="gig"?(a(),o(F,{key:0},[t("div",lt,[w(he,{gig:e.value.context},null,8,["gig"])]),t("div",rt,[it,(a(!0),o(F,null,Q(e.value.context.milestones,(n,E)=>(a(),o("span",dt,[t("span",ut,[t("span",ct,[t("p",vt,g(E+1+"."),1),t("p",ft,g(n.name),1)]),t("span",gt,[w(l($e),{class:"h-6 w-6"}),t("p",null,g(n.price),1)])]),t("p",null,g(n.description.substring(0,300)+"..."),1)]))),256))])],64)):x("",!0)])):x("",!0),t("button",{onClick:B,class:"w-full border-dashed border-2 border-sky-500 rounded-sm p-1"},"Add Clause"),M.value?(a(),o("div",Ot,[w(X,{isLoading:M.value},null,8,["isLoading"])])):(a(),o("div",_t,[t("span",null,[k.value&&k.value.length>0?(a(),o("span",ht,[t("label",pt,g(l(L)&&l(L).name?`${l(L).name}'s `:"Your ")+"clauses",1),t("span",mt,[(a(!0),o(F,null,Q(k.value,n=>(a(),o("div",xt,[n.draft?ie((a(),o("textarea",{key:0,class:"w-full p-2 border rounded-md resize-none focus:border-blue-500 focus:ring-0","onUpdate:modelValue":E=>n.text=E},null,8,bt)),[[de,n.text]]):(a(),o("p",{key:1,class:U(["w-full p-2 border rounded-md",{"bg-gray-200":n.state==l(v).PENDING,"bg-green-200":n.state==l(v).ACCEPTED,"bg-red-200":n.state==l(v).REJECTED}])},g(n.text),3)),n.state!=l(v).PENDING?(a(),o("div",yt,[n.draft?x("",!0):(a(),o("p",{key:0,class:"text-xs underline",onClick:E=>s.$emit("onMentionClause",n)},"Mention",8,Ct)),t("p",{class:U({"text-green-400 text-xs":n.state==l(v).ACCEPTED,"text-red-400 text-xs":n.state==l(v).REJECTED})},g(n.state),3)])):x("",!0),t("div",wt,[n.draft?(a(),se(l(Re),{key:0,class:"h-5 w-5 text-green-400",onClick:E=>f(n)},null,8,["onClick"])):(a(),se(l(Te),{key:1,class:"h-5 w-5 text-blue-400",onClick:E=>te(n.id)},null,8,["onClick"])),w(l(ke),{class:"h-5 w-5",onClick:E=>ee(n.id)},null,8,["onClick"])])]))),256))])])):x("",!0)]),t("span",null,[C.value&&C.value.length>0?(a(),o("span",$t,[t("label",kt,g(l(r).name==e.value.sellerId?e.value.sellerId.substring(0,5):e.value.buyerId.substring(0,5))+"'s clauses",1),t("span",It,[(a(!0),o(F,null,Q(C.value,n=>(a(),o("div",Et,[t("p",{class:U(["w-full p-2 border rounded-md",{"bg-gray-200":n.state==l(v).PENDING,"bg-green-200":n.state==l(v).ACCEPTED,"bg-red-200":n.state==l(v).REJECTED}])},g(n.text),3),t("div",Rt,[t("a",{class:"text-xs underline",onClick:E=>s.$emit("onMentionClause",n)},"Mention",8,Tt),t("div",Mt,[t("a",{class:"text-xs font-semibold text-green-400 underline decoration-green-400",onClick:E=>z(n.id,l(v).ACCEPTED)},"Approve",8,St),t("a",{class:"text-xs font-semibold text-red-400 underline decoration-red-400",onClick:E=>z(n.id,l(v).REJECTED)},"Reject",8,At)])])]))),256))])])):x("",!0)]),t("div",Dt,[t("div",null,[(m=e.value.ready)!=null&&m.includes(e.value.sellerId)?(a(),o("p",Lt,g(e.value.sellerId.substring(0,5))+" is ready",1)):x("",!0),(G=e.value.ready)!=null&&G.includes(e.value.buyerId)?(a(),o("p",Nt,g(e.value.buyerId.substring(0,5))+" is ready",1)):x("",!0)]),e.value.ready.includes(l(r).uid)?x("",!0):(a(),o("button",{key:0,onClick:p,class:"bg-blue-500 text-white px-4 h-8 rounded-md hover:bg-blue-400 transition duration-300 ease-in-out"},"Ready to Proceed ")),e.value.ready.includes(l(r).uid)?(a(),o("button",{key:1,onClick:u,class:"bg-red-500 text-white px-4 h-8 rounded-md hover:bg-red-400 transition duration-300 ease-in-out"},"Cancel ")):x("",!0)]),(H=e.value.ready)!=null&&H.includes(e.value.sellerId)&&((J=e.value.ready)!=null&&J.includes(e.value.buyerId))?(a(),se(me,{key:0,onClick:T,isLoading:I.value},{default:pe(()=>[ue("Proceed ")]),_:1},8,["isLoading"])):x("",!0)]))])):!e.value.id&&!N.value?(a(),o("div",Pt,Ut)):(a(),o("div",Ft,[w(X,{isLoading:M.value},null,8,["isLoading"])]))}}}),qt={class:"flex flex-row gap-2 h-16 border-b items-center pl-2 sticky top-16 bg-white"},Bt={class:"flex flex-col gap-2 sm:grid sm:grid-rows-1 sm:grid-cols-2 gap-x-4 p-2"},Ht=oe({__name:"MessagingView",props:{adId:{type:String,required:!1},contractId:{type:String,required:!1}},setup(R){const D=b({}),i=d=>{!d||!d.id||d.draft||(D.value=d)},$=()=>{D.value={}},y=b("messaging_content"),_=d=>{const r=document.getElementById(d);if(r){if(y.value=d,d=="messaging_content"){r.scrollIntoView({behavior:"smooth",block:"end"});return}r.scrollIntoView({behavior:"smooth",block:"start"})}};return(d,r)=>(a(),o(F,null,[t("div",qt,[t("p",{onClick:r[0]||(r[0]=L=>_("messaging_content")),class:U(["font-bold hover:underline",y.value=="messaging_content"?"text-cyan-600 underline":""])},"Messaging",2),t("p",{onClick:r[1]||(r[1]=L=>_("contract_content")),class:U(["font-bold hover:underline",y.value=="contract_content"?"text-cyan-600 underline":""])},"Contract",2)]),t("div",Bt,[w(st,{id:"messaging_content",class:"min-h-[400px] h-[400px]",clauseMentionned:D.value,onOnRemoveMentionnedClause:$,adId:R.adId},null,8,["clauseMentionned","adId"]),w(Vt,{id:"contract_content",adId:R.adId,onOnMentionClause:i},null,8,["adId"])])],64))}});export{Ht as default};
