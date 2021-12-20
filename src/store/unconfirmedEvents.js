import {
  doc,
  getDoc,
  addDoc,
  getFirestore,
  arrayUnion,
  updateDoc,
  collection,
  setDoc,
  arrayRemove
} from "firebase/firestore";
const state = {
  ownEvents: [],
  foreignEvents: [],
}
const mutations = {
  setOwnUnconfirmedEvents(state, value) {
    state.ownEvents = value;
  },
  setForeignUnconfirmedEvents(state, value) {
    state.foreignEvents = value;
  }
}
const actions = {
  async fetchUnconfirmedEvents({
    commit
  }, uids) {
    const db = getFirestore();
    const docRef = doc(db, "Nutzer", uids.targetUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().unconfirmedEvents);
      var events = []
      if (docSnap.data().unconfirmedEvents) {
        docSnap.data().unconfirmedEvents.forEach(async event => {
          const eventRef = doc(db, "Termine", event);
          const eventSnap = await getDoc(eventRef);
          if (eventSnap.exists()) {
            events.push(eventSnap.data())
          }
        });
      }
      if (uids.ownUid == uids.targetUid) {
        commit("setOwnUnconfirmedEvents", events);
      } else {
        commit("setForeignUnconfirmedEvents", events);
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      if (uids.ownUid == uids.targetUid) {
        commit("setOwnUnconfirmedEvents", []);
      } else {
        commit("setForeignUnconfirmedEvents", []);
      }
    }
  },
  async createUnconfirmedEvents({
    dispatch
  }, event) {
    const db = getFirestore();
    event.newElement.receiver = event.uids.targetUid
    const eventRef = await addDoc(collection(db, "Termine"), event.newElement);
    await updateDoc(eventRef, {
      id: eventRef.id
    });
    const calRef = doc(db, "Nutzer", event.uids.targetUid);
    const calSnap = await getDoc(calRef);
    if (calSnap.exists()) {
      await updateDoc(calRef, {
        unconfirmedEvents: arrayUnion(eventRef.id)
      });
    } else {
      var eventsObj = {
        unconfirmedEvents: new Array(eventRef.id)
      }
      await setDoc(calRef, eventsObj, {
        merge: true
      });
    }
    dispatch('fetchUnconfirmedEvents', event.uids);
  },

  async confirmUnconfirmedEvents({
    dispatch, getters
  }, event) {
    console.log("Lets go")
    const db = getFirestore();
    const receiverRef = doc(db, "Nutzer", event.confirmedEvent.receiver);
    const receiverSnap = await getDoc(receiverRef);
    if (receiverSnap.exists()) {
      await updateDoc(receiverRef, {
        events: arrayUnion(event.confirmedEvent.id)
      });
      await updateDoc(receiverRef, {
        unconfirmedEvents: arrayRemove(event.confirmedEvent.id)
      });
    } else {
      var eventsObj = {
        events: new Array(event.confirmedEvent.id)
      }
      await setDoc(receiverRef, eventsObj, {
        merge: true
      });
      await updateDoc(receiverRef, {
        unconfirmedEvents: arrayRemove(event.confirmedEvent.id)
      });
    }
    const creatorRef = doc(db, "Nutzer", event.confirmedEvent.creator);
    const creatorSnap = await getDoc(creatorRef);
    if (creatorSnap.exists()) {
      await updateDoc(creatorRef, {
        events: arrayUnion(event.confirmedEvent.id)
      });
      await updateDoc(creatorRef, {
        unconfirmedEvents: arrayRemove(event.confirmedEvent.id)
      });
    } else {
      eventsObj = {
        events: new Array(event.confirmedEvent.id)
      }
      await setDoc(creatorRef, eventsObj, {
        merge: true
      });
      await updateDoc(creatorRef, {
        unconfirmedEvents: arrayRemove(event.confirmedEvent.id)
      });
    }
    console.log("I did it")
    dispatch('fetchOwnEvents', getters.getUID);
    dispatch('fetchUnconfirmedEvents', event.uids);
  }
}
const getters = {
  getOwnUnconfirmedEvents(state) {
    return state.ownEvents
  },
  getForeignUnconfirmedEvents(state) {
    return state.foreignEvents
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}