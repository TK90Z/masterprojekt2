import {
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
const state = {
  loggedIn: false,
  rights: null,
  data:null
}
const mutations = {
  SET_LOGGED_IN(state, value) {
    state.loggedIn = value;
  },
  SET_USER(state, data) {
    console.log(data)
    state.data = data;
  },
  setRights(state, value) {
    state.rights = value;
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
        email: user.email,
        uid: user.uid
      });
    } else {
      commit("SET_USER", null);
    }
    console.log(state.loggedIn)

    const db = getFirestore();
    const docRef = doc(db, "Nutzer", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().rights);
      commit("setRights", docSnap.data().rights);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      commit("setRights", 0);
    }
  }
}
const getters = {
  getUser(state) {
    return state.data
  },
  isLoggedIn(state) {
    return state.loggedIn
  },
  getRights(state) {
    return state.rights
  },
  getUID(state) {
    return state.data.uid
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}