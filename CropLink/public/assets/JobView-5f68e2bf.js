import{d as _,r as n,o as p,e as o,f as l,k as t,t as s,p as i,q as f,x,F as v,m,L as h,a5 as y,j as b}from"./index-d4d9ec3f.js";const g={key:0,class:"inset-0 overflow-y-auto"},j={class:"flex min-h-full items-center justify-center p-4 text-center"},w={class:"flex flex-col gap-2 justify-start items-start border rounded-md w-96"},k={class:"px-5 pt-5 text-left"},L={class:"text-xl font-bold"},B={class:"text-md"},I={class:"text-md"},V={class:"text-md"},q={class:"w-full border-t-2 h-64 overflow-y-scroll"},C={class:"text-md text-left p-5"},F={class:"w-full flex flex-col gap-2 justify-start items-start px-5 pb-5"},J={class:"text-md"},M={key:1},$=_({__name:"JobView",props:{jobId:{type:String,required:!0}},setup(c){const d=c,e=n({}),a=n(!1),r=async()=>{a.value=!0,e.value=await y("jobs",d.jobId,"jobId"),a.value=!1};return p(async()=>{await r()}),(N,S)=>e.value&&!a.value?(o(),l("div",g,[t("div",j,[t("div",w,[t("span",k,[t("h1",L,s(e.value.title),1),t("p",B,s(e.value.location),1),t("p",I,"$"+s(e.value.salaryMin)+" - "+s(e.value.salaryMax),1),t("p",V,s(e.value.type),1),i(x,null,{default:f(()=>[b(" Apply ")]),_:1})]),t("div",q,[t("p",C,s(e.value.description),1)]),t("div",F,[(o(!0),l(v,null,m(e.value.tasks,u=>(o(),l("div",null,[t("p",J,s(u),1)]))),256))])])])])):(o(),l("div",M,[i(h,{isLoading:a.value},null,8,["isLoading"])]))}});export{$ as default};
