import{d as _,h as n,o as p,e as o,f as l,g as t,t as s,m as i,n as f,_ as v,F as x,k as m,L as h,a2 as y,i as b}from"./index-8dd656b9.js";const g={key:0,class:"inset-0 overflow-y-auto"},w={class:"flex min-h-full items-center justify-center p-4 text-center"},j={class:"flex flex-col gap-2 justify-start items-start border rounded-md w-96"},k={class:"px-5 pt-5 text-left"},L={class:"text-xl font-bold"},B={class:"text-md"},I={class:"text-md"},V={class:"text-md"},C={class:"w-full border-t-2 h-64 overflow-y-scroll"},F={class:"text-md text-left p-5"},J={class:"w-full flex flex-col gap-2 justify-start items-start px-5 pb-5"},M={class:"text-md"},N={key:1},$=_({__name:"JobView",props:{jobId:{type:String,required:!0}},setup(c){const d=c,e=n({}),a=n(!1),r=async()=>{a.value=!0,e.value=await y("jobs",d.jobId,"jobId"),a.value=!1};return p(async()=>{await r()}),(S,q)=>e.value&&!a.value?(o(),l("div",g,[t("div",w,[t("div",j,[t("span",k,[t("h1",L,s(e.value.title),1),t("p",B,s(e.value.location),1),t("p",I,"$"+s(e.value.salaryMin)+" - "+s(e.value.salaryMax),1),t("p",V,s(e.value.type),1),i(v,null,{default:f(()=>[b(" Apply ")]),_:1})]),t("div",C,[t("p",F,s(e.value.description),1)]),t("div",J,[(o(!0),l(x,null,m(e.value.tasks,u=>(o(),l("div",null,[t("p",M,s(u),1)]))),256))])])])])):(o(),l("div",N,[i(h,{isLoading:a.value},null,8,["isLoading"])]))}});export{$ as default};