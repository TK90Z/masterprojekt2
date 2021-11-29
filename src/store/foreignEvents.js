import { doc, getDoc, setDoc, getFirestore, } from "firebase/firestore";
const state = {
  events: []
}
const mutations = {
  setForeignEvents(state, value){
    state.events = value;
  }
}
const actions = {
  async fetchForeignEvents({
    commit
  }, uid) {

    const db = getFirestore();
    const docRef = doc(db, "Kalender", uid);
    const docSnap = await getDoc(docRef);

console.log("getting")

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().events);
      commit("setForeignEvents", docSnap.data().events);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  },
  async updateOwnEvents(events, user) {
    const db = getFirestore();
    const docRef = doc(db, "Kalender", user.data.uid);
    setDoc(docRef, events, { merge: true });
  }
}
const getters = {
  getForeignEvents(state) {
    return state.events
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}