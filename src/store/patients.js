import {
    doc,
    getDoc,
    getFirestore,
  } from "firebase/firestore";
  const state = {
    patients: [],
    ownPatients: [],
  }
  const mutations = {
    setPatients(state, value){
        state.patients = value;
      },
      setOwnPatients(state, value){
        state.ownPatients = value;
      }
  }
  const actions = {
    async fetchPatients({
      commit
    }) {
      const db = getFirestore();
      const patientRef = doc(db, "Typen", "qiL18SAnqonCvvcL17s8");
      const patientSnap = await getDoc(patientRef);
  
      if (patientSnap.exists()) {
        console.log("Document data:", patientSnap.data().patients);
        var patients = []
        if (patientSnap.data().patients) {
          patientSnap.data().patients.forEach(async patient => {
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
    async fetchOwnPatients({
      commit
    }, uid) {
      console.log(uid)
      const db = getFirestore();
      const patientRef = doc(db, "Nutzer", uid);
      const patientSnap = await getDoc(patientRef);
  
      if (patientSnap.exists()) {
        console.log("Document data:", patientSnap.data().patients);
        var patients = []
        if (patientSnap.data().patients) {
          patientSnap.data().patients.forEach(async patient => {
            const patientRef = doc(db, "Nutzer", patient);
            const patientSnap = await getDoc(patientRef);
            if (patientSnap.exists()) {
              patients.push(patientSnap.data())
            }
          });
        }
        commit("setOwnPatients", patients);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        commit("setOwnPatients", []);
      }
    }
  }

  const getters = {
    getPatients(state) {
        return state.patients
      },
      getOwnPatients(state) {
        return state.ownPatients
      },
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }