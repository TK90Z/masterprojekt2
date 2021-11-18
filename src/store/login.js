import { doc, getDoc, getFirestore, } from "firebase/firestore";
const state = {
  user: {
    loggedIn: false,
    data: null,
    rights: null
  }
}
const mutations = {
  SET_LOGGED_IN(state, value) {
    state.user.loggedIn = value;
  },
  SET_USER(state, data) {
    state.user.data = data;
  },
  setRights(state, value){
    state.user.rights = value;
  }
}
const actions = {
  async fetchUser({
    commit
  }, user) {
    commit("SET_LOGGED_IN", user !== null);
    if (user) {
      commit("SET_USER", {
        displayName: user.displayName,
        email: user.email
      });
    } else {
      commit("SET_USER", null);
    }
    console.log(state.user.loggedIn)

    const db = getFirestore();
    const docRef = doc(db, "Rechte", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().rights);
      commit("setRights", 0);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }
}
const getters = {
  user(state) {
    return state.user
  },
  isLoggedIn(state) {
    return state.user.loggedIn
  },
  getRights(state) {
    return state.user.rights
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}