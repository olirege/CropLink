// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getDocument } from "../firebase/utils";
import { ref, type Ref } from 'vue'
import { createUserProfileCallable, createAdCallable, postAdCallable, placeBidCallable, cancelBidCallable, removeAdCallable, editAdCallable } from '@/firebase/callables';
import type { User, Profile, BuyerAd, SellerAd } from '@/types';
import { getAuth } from 'firebase/auth';
export const useMainStore = defineStore('MainStore', () => {
  const ACCOUNT_TYPES = {
    SELLER:'seller',
    BUYER:'buyer',
    EMPLOYER:'employer',
    EMPLOYEE:'employee',
    BANKER:'bank',
  }
  const BID_STATUSES = {
    PENDING:'pending',
    ACCEPTED:'accepted',
    REJECTED:'rejected',
  }
  const user:null|User = ref(null)
  const isNewUser = ref(false)

  const profile: Ref<null|Profile> = ref(null)
  const setUser = (newUser: any) => {
    user.value = newUser
  }
  const setNewUser = (newUser: any) => {
    console.log("setNewUser", newUser)
    isNewUser.value = newUser
  }
  const continueSignup = async (profileData:Profile) => {
    let profile = null;
    if(isNewUser.value) {
        console.log("Profile setup mounted for new user")
        profile = await createUser(profileData);
        setProfile(profileData);
    } else {
        console.log("continueSignup This is an existing user fetching profile")
        if(!user.value) throw new Error('continueSignup No user')
        profile = await getDocument("users", user.value.uid);
        setProfile(profileData);
        if(!profile) {
          throw new Error('continueSignup No profile')
        }
    }
    setProfile(profile);
  }
  const createUserProfile = createUserProfileCallable();
  const createUser = async (profileData:Profile) => {
    try {
      console.log("createUser start", profileData);
      console.log("createUserProfile", createUserProfile)
      const profile = await createUserProfile({...profileData});
      console.log("createUser res", profile);
      return profile;
    } catch (error:any) {
      console.log("createUser error", error);
      throw new Error(error);
    }
  }
  const setProfile = (newProfile: any) => {
    console.log('setProfile', newProfile)
    if(!newProfile) throw new Error('No profile') 
    profile.value = newProfile
  }
  const getProfile = async () => {
    console.log('getProfile')
    if(!user.value) throw new Error('No user')
    const profileDoc = await getDocument("users", user.value.uid)
    profile.value = profileDoc as Profile
  }
  const createAd = createAdCallable();
  const createUserAd = async (adData:SellerAd | BuyerAd) => {
    try {
      console.log("createUserAd start", adData);
      console.log("createAd", createAd)
      const ad = await createAd({...adData});
      console.log("createUserAd res", ad);
      return ad;
    } catch (error:any) {
      console.log("createUserAd error", error);
      throw new Error(error);
    }
  }
  const postAd = postAdCallable();
  const postNewAd = async (adId:string) => {
    try {
      console.log("postAd start", adId);
      console.log("createAd", createAd)
      const ad = await postAd({adId});
      console.log("postAd res", ad);
      return ad;
    } catch (error:any) {
      console.log("postAd error", error);
      throw new Error(error);
    }
  }
  const removeAd = removeAdCallable();
  const removeUserAd = async (adId:string) => {
    try {
      console.log("removeUserAd start", adId);
      console.log("createAd", createAd)
      const ad = await removeAd({adId});
      console.log("removeUserAd res", ad);
      return ad;
    } catch (error:any) {
      console.log("removeUserAd error", error);
      throw new Error(error);
    }
  }
  const editAd = editAdCallable();
  const editUserAd = async (changeData:object) => {
    try {
      console.log("editUserAd start", changeData);
      console.log("editUserAd", editAd)
      const ad = await editAd({...changeData});
      console.log("editUserAd res", ad);
      return ad;
    } catch (error:any) {
      console.log("editUserAd error", error);
      throw new Error(error);
    }
  }
  const signout = async () => {
    const auth = getAuth()
    console.log("signout")
    await auth.signOut()
    setUser(null)
    setProfile(null)
  }
  const placeBid = placeBidCallable();
  const placeNewBid = async (bidData:object) => {
    console.log("placeBid", bidData)
    try {
      console.log("placeBid start", bidData);
      console.log("placeBid", placeBid)
      const bid = await placeBid(bidData);
      console.log("placeBid res", bid);
      return bid;
    } catch (error:any) {
      console.log("placeBid error", error);
      throw new Error(error);
    }
  }
  const cancelBid = cancelBidCallable();
  const cancelUserBid = async (bidId:string) => {
    try {
      console.log("cancelBid start", bidId);
      console.log("cancelBid", cancelBid)
      const bid = await cancelBid({bidId});
      console.log("cancelBid res", bid);
      return bid;
    } catch (error:any) {
      console.log("cancelBid error", error);
      throw new Error(error);
    }
  }
  return { 
    user,
    setUser,
    createUser,
    getProfile,
    setProfile,
    setNewUser,
    isNewUser,
    continueSignup,
    profile,
    ACCOUNT_TYPES,
    createUserAd,
    postNewAd,
    signout,
    BID_STATUSES,
    placeNewBid,
    cancelUserBid,
    removeUserAd,
    editUserAd,
   }
})
