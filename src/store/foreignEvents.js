import {
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
const state = {
  events: []
}
const mutations = {
  setForeignEvents(state, value) {
    state.events = value;
  }
}
const actions = {
  async fetchForeignEvents({
    commit
  }, uid) {
    const db = getFirestore();
    const docRef = doc(db, "Nutzer", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().events);
      var events = []
      if (docSnap.data().events) {
        docSnap.data().events.forEach(async event => {
          const eventRef = doc(db, "Termine", event);
          const eventSnap = await getDoc(eventRef);
          if (eventSnap.exists()) {
            events.push(eventSnap.data())
          }
        });
      }
      commit("setForeignEvents", events);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      commit("setForeignEvents", []);
    }
  },
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