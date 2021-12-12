import {
    doc,
    getDoc,
    getFirestore,
  } from "firebase/firestore";
  const state = {
    meds: [],
  }
  const mutations = {
    setMeds(state, value){
        state.meds = value;
      }
  }
  const actions = {
    async fetchMeds({
      commit
    }) {
  
      const db = getFirestore();
      const docSnap = await db.collection('Medikaments').get()
  
  console.log("getting")
  
      if (docSnap.exists()) {
        var data = snapshot.docs.map(doc => doc.data());
        console.log("Document data:", data);
        commit("setMeds", data);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    },
  }
  const getters = {
    getMeds(state) {
        return state.meds
      },
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }