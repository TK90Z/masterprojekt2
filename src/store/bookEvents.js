import { doc, getDoc, setDoc, getFirestore, } from "firebase/firestore";
const state = {
  events: []
}
const mutations = {
  setUnconfirmedEvents(state, value){
    state.events = value;
  }
}
const actions = {
  async fetchUnconfirmedEvents({
    commit
  }, uid) {

    const db = getFirestore();
    const docRef = doc(db, "UnbestaetigteTermine", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().events);
      commit("setUnconfirmedEvents", docSnap.data().events);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  },
  async updateUnconfirmedEvents(events, uid) {
    const db = getFirestore();
    const docRef = doc(db, "UnbestaetigteTermine", uid);
    setDoc(docRef, events, { merge: true });
  }
}
const getters = {
  getUnconfirmedEvents(state) {
    return state.events
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}