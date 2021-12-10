import {
    doc,
    getDoc,
    getFirestore,
  } from "firebase/firestore";
  const state = {
    patients: false,
  }
  const mutations = {
    setPatients(state, value){
        state.patients = value;
      }
  }
  const actions = {
    async fetchPatients({
      commit
    }) {
  
      const db = getFirestore();
      const docRef = doc(db, "Typen", "qiL18SAnqonCvvcL17s8");
      const docSnap = await getDoc(docRef);
  
  console.log("getting")
  
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data().patients);
        commit("setPatients", docSnap.data().patients);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    },
  }
  const getters = {
    getPatients(state) {
        return state.patients
      },
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }