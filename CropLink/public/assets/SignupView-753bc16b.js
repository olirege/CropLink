import{d as c,u as l,r,o as d,E as a,a as u,b as i,c as p,e as _,f,g,_ as m}from"./index-9479e00e.js";const v="/assets/croplink_logo-481860de.png",x={class:"flex flex-col items-center sm:grid sm:grid-cols-2 sm:h-[500px]"},h=g('<div class="flex flex-col items-center justify-center my-6" data-v-11e83978><img src="'+v+'" alt="CropLink Logo" class="rounded-full w-2/5 sm:w-3/5" data-v-11e83978></div><div class="flex flex-col gap-6 relative" data-v-11e83978><div class="flex flex-col gap-2 items-center justify-center" data-v-11e83978><p class="text-6xl font-bold" data-v-11e83978>CropLink</p><p class="text-lg sm:text-2xl pl-2 italic" data-v-11e83978>Connect Farmers and Buyers now</p><p class="italic text-red-500" data-v-11e83978>Sign up currently disabled.</p></div></div>',2),I=[h],S=c({__name:"SignupView",setup(w){const s=l();return r(!0),d(()=>{const t={signInOptions:[{provider:a.PROVIDER_ID,signInMethod:a.EMAIL_LINK_SIGN_IN_METHOD,forceSameDevice:!1}],signInSuccessUrl:"/",callBacks:{uiShown:e=>{console.log(e)},signInSuccessWithAuthResult:e=>{var o,n;return console.log(e),(o=e.additionalUserInfo)!=null&&o.isNewUser?(console.log("signInSuccessWithAuthResult set new user"),u().setNewUser((n=e.additionalUserInfo)==null?void 0:n.isNewUser),s.push({name:"profile-setup"})):s.push({name:"home"}),!1}}};i.start("#firebaseui-auth-container",t)}),p(()=>{i.delete()}),(t,e)=>(_(),f("div",x,I))}});const N=m(S,[["__scopeId","data-v-11e83978"]]);export{N as default};
