import {
  doc,
  getDoc,
  addDoc,
  getFirestore,
  arrayUnion,
  updateDoc,
  collection,
  setDoc
} from "firebase/firestore";
const state = {
  events: []
}
const mutations = {
  setOwnEvents(state, value) {
    state.events = value;
  }
}
const actions = {
  async fetchOwnEvents({
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
      commit("setOwnEvents", events);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      commit("setOwnEvents", []);
    }
  },
  async createOwnEvents({
    dispatch
  }, event) {
    const db = getFirestore();
    event.newElement.receiver = event.uid
    const eventRef = await addDoc(collection(db, "Termine"), event.newElement);
    await updateDoc(eventRef, {
      id: eventRef.id
    });
    const calRef = doc(db, "Nutzer", event.uid);
    const calSnap = await getDoc(calRef);
    if (calSnap.exists()) {
      await updateDoc(calRef, {
        events: arrayUnion(eventRef.id)
      });
    } else {
      var eventsObj = {
        events: new Array(eventRef.id)
      }
      await setDoc(calRef, eventsObj, {
        merge: true
      });
    }
    dispatch('fetchOwnEvents', event.uid);
  }
}
const getters = {
  getOwnEvents(state) {
    return state.events
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}