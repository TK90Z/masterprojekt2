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
      const querySnapshot = await getDocs(collection(db, "Medikamente"));
  
  console.log("getting")
  
      if (docSnap.exists()) {
        var meds = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            meds.add(doc.data())
          });
        commit("setMeds", meds);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such collection!");
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