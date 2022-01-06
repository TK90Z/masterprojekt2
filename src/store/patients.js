import {
    doc,
    getDoc,
    getFirestore,
  } from "firebase/firestore";
  const state = {
    patients: [],
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
        var patients = []
        if (docSnap.data().patients) {
          docSnap.data().patients.forEach(async patient => {
            const patientRef = doc(db, "Nutzer", patient);
            const patientSnap = await getDoc(patientRef);
            if (patientSnap.exists()) {
              patients.push(patientSnap.data())
            }
          });
        }
        commit("setPatients", patients);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        commit("setPatients", []);
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