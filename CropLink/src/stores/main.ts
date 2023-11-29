// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getDocument, getDocuments } from "../firebase/utils";
import { ref, type Ref } from 'vue'
import { 
  createUserProfileCallable, 
 } from '@/firebase/callables';
import type { User, Profile } from '@/types';
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
    profile.value = newProfile
  }
  const getProfile = async () => {
    console.log('getProfile')
    if(!user.value) throw new Error('No user')
    const profileDoc = await getDocument("users", user.value.uid)
    profile.value = profileDoc as Profile
  }
  const signout = async () => {
    const auth = getAuth()
    console.log("signout")
    await auth.signOut()
    setUser(null)
    setProfile(null)
  }
  const getProduce = async () => {
    console.log('getProduce')
    const produceDoc = await getDocuments("produce")
    return produceDoc
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
  
    signout,
    BID_STATUSES,
    AD_STATUSES,
    CLAUSE_STATUSES,
    getProduce,
   }
})
