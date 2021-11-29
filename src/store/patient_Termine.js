import { doc, getDoc, setDoc, getFirestore, } from "firebase/firestore";
const state = {
  events: []
}
const mutations = {
  setEvents(state, value){
    state.events = value;
  }
}
const actions = {
  async fetchPatientEvents({
    commit
  }, uid) {

    const db = getFirestore();
    const docRef = doc(db, "Kalender", uid);
    const docSnap = await getDoc(docRef);

console.log("getting")

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().events);
      commit("setEvents", docSnap.data().events);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  },
  async updatePatientEvents(events, user) {
    const db = getFirestore();
    const docRef = doc(db, "Kalender", user.data.uid);
    setDoc(docRef, events, { merge: true });
  }
}
const getters = {
  getEvents(state) {
    return state.events
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}