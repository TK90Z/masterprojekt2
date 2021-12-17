import {
    doc,
    updateDoc,
    arrayRemove,
    getFirestore,
    deleteDoc
  } from "firebase/firestore";
  const state = {
  }
  const mutations = {
  }
  const actions = {
    async deleteEvent({
      dispatch
    }, event) {
        console.log(dispatch)
        const db = getFirestore();
        await deleteDoc(doc(db, "Termine", event.id));
        const creatorRef = doc(db, "Nutzer", event.creator);
        await updateDoc(creatorRef, {
            events: arrayRemove(event.id),
            unconfirmedEvents: arrayRemove(event.id),
        });
        const receiverRef = doc(db, "Nutzer", event.creator);
        await updateDoc(receiverRef, {
            events: arrayRemove(event.id),
            unconfirmedEvents: arrayRemove(event.id),
        });
    },
  }
  const getters = {

  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }