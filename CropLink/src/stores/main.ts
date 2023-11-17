// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getDocument, getDocuments } from "../firebase/utils";
import { ref, type Ref } from 'vue'
import { 
  createUserProfileCallable, 
  createAdCallable, 
  postAdCallable, 
  placeBidCallable, 
  cancelBidCallable, 
  removeAdCallable, 
  editAdCallable,
  createEscrowAccountCallable,
  linkEscrowAccountCallable,
  createJobPostCallable,
  editJobPostCallable,
  removeJobPostCallable,
  postJobPostCallable,
  takedownJobPostCallable,
  createGigPostCallable,
  editGigPostCallable,
  removeGigPostCallable,
  postGigPostCallable,
  takedownGigPostCallable,
  sendDmCallable,
  updateProfileCallable,
  submitApplicationCallable,
  removeApplicationCallable,
 } from '@/firebase/callables';
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
  const AD_STATUSES = {
    POSTED:'posted',
    REJECTED:'rejected',
    SOLD:'sold',
  }
  const CLAUSE_STATUSES = {
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
      const ad = await postAd({adId});
      console.log("postAd res", ad);
      return ad;
    } catch (error:any) {
      console.log("postAd error", error);
      throw new Error(error);
    }
  }
  const takedownAd = postAdCallable();
  const takedownUserAd = async (adId:string) => {
    try {
      console.log("takedownAd start", adId);
      const ad = await takedownAd({adId});
      console.log("takedownAd res", ad);
      return ad;
    } catch (error:any) {
      console.log("takedownAd error", error);
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
  const createEscrowAccount = createEscrowAccountCallable();
  const createEscrowUserAccount = async (escrowUserAccountData:object) => {
    try {
      console.log("createEscrowUserAccount start");
      console.log("createEscrowAccount", createEscrowAccount)
      const escrowAccount = await createEscrowAccount(escrowUserAccountData);
      console.log("createEscrowUserAccount res", escrowAccount);
      return escrowAccount;
    } catch (error:any) {
      console.log("createEscrowUserAccount error", error);
      throw new Error(error);
    }
  }
  const linkEscrowAccount = linkEscrowAccountCallable();
  const linkEscrowUserAccount = async (escrowUserAccountData:object) => {
    try {
      console.log("linkEscrowUserAccount start");
      console.log("createEscrowAccount", createEscrowAccount)
      const escrowAccount = await linkEscrowAccount(escrowUserAccountData);
      console.log("linkEscrowUserAccount res", escrowAccount);
      return escrowAccount;
    } catch (error:any) {
      console.log("linkEscrowUserAccount error", error);
      throw new Error(error);
    }
  }
  const getProduce = async () => {
    console.log('getProduce')
    const produceDoc = await getDocuments("produce")
    return produceDoc
  }
  const createJobPost = createJobPostCallable();
  const createJobPostAd = async (jobPostData:object) => {
    try {
      console.log("createJobPostAd start");
      console.log("createJobPostAd", createJobPost)
      const response = await createJobPost(jobPostData);
      console.log("createJobPostAd res", jobPostData);
      return response;
    } catch (error:any) {
      console.log("createJobPostAd error", error);
      throw new Error(error);
    }
  }
  const postJobPost = postJobPostCallable();
  const postJobPostAd = async (jobId:string) => {
    try {
      console.log("postJobPostAd start", jobId);
      console.log("postJobPostAd", postJobPost)
      const response = await postJobPost({jobId});
      console.log("postJobPostAd res", jobId);
      return response;
    } catch (error:any) {
      console.log("postJobPostAd error", error);
      throw new Error(error);
    }
  }
  const takedownJobPost = takedownJobPostCallable();
  const takedownJobPostAd = async (jobId:string) => {
    try {
      console.log("takedownJobPostAd start", jobId);
      console.log("takedownJobPostAd", takedownJobPost)
      const response = await takedownJobPost({jobId});
      console.log("takedownJobPostAd res", jobId);
      return response;
    } catch (error:any) {
      console.log("takedownJobPostAd error", error);
      throw new Error(error);
    }
  }
  const editJobPost = editJobPostCallable();
  const editJobPostAd = async (jobPostChangesData:object) => {
    try {
      console.log("editJobPostAd start");
      console.log("editJobPostAd", editJobPost)
      const response = await editJobPost(jobPostChangesData);
      console.log("editJobPostAd res", jobPostChangesData);
      return response;
    } catch (error:any) {
      console.log("editJobPostAd error", error);
      throw new Error(error);
    }
  }
  const removeJobPost = removeJobPostCallable();
  const removeJobPostAd = async (jobId:string) => {
    try {
      console.log("removeJobPostAd start");
      console.log("removeJobPostAd", removeJobPost)
      const response = await removeJobPost({jobId});
      console.log("removeJobPostAd res", jobId);
      return response;
    } catch (error:any) {
      console.log("removeJobPostAd error", error);
      throw new Error(error);
    }
  }
  const createGigPost = createGigPostCallable();
  const createGigPostAd = async (gigPostData:object) => {
    try {
      console.log("createGigPostAd start");
      console.log("createGigPostAd", createGigPost)
      const response = await createGigPost(gigPostData);
      console.log("createGigPostAd res", gigPostData);
      return response;
    } catch (error:any) {
      console.log("createGigPostAd error", error);
      throw new Error(error);
    }
  }
  const postGigPost = postGigPostCallable();
  const postGigPostAd = async (gigId:string) => {
    try {
      console.log("postGigPostAd start", gigId);
      console.log("postGigPostAd", postGigPost)
      const response = await postGigPost({gigId});
      console.log("postGigPostAd res", gigId);
      return response;
    } catch (error:any) {
      console.log("postGigPostAd error", error);
      throw new Error(error);
    }
  }
  const takedownGigPost = takedownGigPostCallable();
  const takedownGigPostAd = async (gigId:string) => {
    try {
      console.log("takedownGigPostAd start", gigId);
      console.log("takedownGigPostAd", takedownGigPost)
      const response = await takedownGigPost({gigId});
      console.log("takedownGigPostAd res", gigId);
      return response;
    } catch (error:any) {
      console.log("takedownGigPostAd error", error);
      throw new Error(error);
    }
  }
  const editGigPost = editGigPostCallable();
  const editGigPostAd = async (gigPostChangesData:object) => {
    try {
      console.log("editGigPostAd start");
      console.log("editGigPostAd", editGigPost)
      const response = await editGigPost(gigPostChangesData);
      console.log("editGigPostAd res", gigPostChangesData);
      return response;
    } catch (error:any) {
      console.log("editGigPostAd error", error);
      throw new Error(error);
    }
  }
  const removeGigPost = removeGigPostCallable();
  const removeGigPostAd = async (gigId:string) => {
    try {
      console.log("removeGigPostAd start");
      console.log("removeGigPostAd", removeGigPost)
      const response = await removeGigPost({gigId});
      console.log("removeGigPostAd res", gigId);
      return response;
    } catch (error:any) {
      console.log("removeGigPostAd error", error);
      throw new Error(error);
    }
  }
  const sendDirectMessage = sendDmCallable();
  const sendDm = async (messageData:object) => {
    try {
      console.log("sendDm start");
      console.log("sendDm", sendDirectMessage)
      const response = await sendDirectMessage(messageData);
      console.log("sendDm res", messageData);
      return response;
    } catch (error:any) {
      console.log("sendDm error", error);
      throw new Error(error);
    }
  }
  const updateUserProfileCallable = updateProfileCallable();
  const updateProfileChanges = async (changes:object) => {
    try {
      console.log("updateProfileChanges start");
      console.log("updateProfileChanges", changes)
      const response = await updateUserProfileCallable(changes);
      console.log("updateProfileChanges res", changes);
      return response;
    } catch (error:any) {
      console.log("updateProfileChanges error", error);
      throw new Error(error);
    }
  }
  const submitUserApplicationCallable = submitApplicationCallable();
  const submitApplication = async (applicationData:object) => {
    try {
      console.log("submitApplication start");
      console.log("submitApplication", submitUserApplicationCallable)
      const response = await submitUserApplicationCallable(applicationData);
      console.log("submitApplication res", applicationData);
      return response;
    } catch (error:any) {
      console.log("submitApplication error", error);
      throw new Error(error);
    }
  }
  const removeUserApplicationCallable = removeApplicationCallable();
  const removeApplication = async (applicationId:string) => {
    try {
      console.log("removeApplication start");
      console.log("removeApplication", removeUserApplicationCallable)
      const response = await removeUserApplicationCallable({applicationId});
      console.log("removeApplication res", applicationId);
      return response;
    } catch (error:any) {
      console.log("removeApplication error", error);
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
    takedownUserAd,
    signout,
    BID_STATUSES,
    AD_STATUSES,
    placeNewBid,
    cancelUserBid,
    removeUserAd,
    editUserAd,
    CLAUSE_STATUSES,
    createEscrowUserAccount,
    linkEscrowUserAccount,
    getProduce,
    createJobPostAd,
    editJobPostAd,
    removeJobPostAd,
    postJobPostAd,
    takedownJobPostAd,
    createGigPostAd,
    editGigPostAd,
    removeGigPostAd,
    postGigPostAd,
    takedownGigPostAd,
    sendDm,
    updateProfileChanges,
    submitApplication,
    removeApplication,
   }
})
