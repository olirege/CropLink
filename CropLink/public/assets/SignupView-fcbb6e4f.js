import{d as u,u as c,o as l,E as a,a as d,b as r,c as _,e as f,f as h,g as s}from"./index-b85785d0.js";const p=s("h1",null,"This is a signup page",-1),g=s("div",{id:"firebaseui-auth-container"},null,-1),I=s("div",{id:"loader"},"Loading...",-1),m=[p,g,I],E=u({__name:"SignupView",setup(S){const n=c();return l(()=>{const o={signInOptions:[{provider:a.PROVIDER_ID,signInMethod:a.EMAIL_LINK_SIGN_IN_METHOD,forceSameDevice:!1}],signInSuccessUrl:"/feed",callBacks:{uiShown:()=>{console.log("uiShown"),document.getElementById("loader").style.display="none"},signInSuccessWithAuthResult:e=>{var i,t;return console.log(e),(i=e.additionalUserInfo)!=null&&i.isNewUser?(console.log("signInSuccessWithAuthResult set new user"),d().setNewUser((t=e.additionalUserInfo)==null?void 0:t.isNewUser),n.push({name:"profile-setup"})):n.push({name:"userboard"}),!1}}};r.start("#firebaseui-auth-container",o)}),_(()=>{r.delete()}),(o,e)=>(f(),h("div",null,m))}});export{E as default};
