import {
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
const state = {
  doctors: [],
}
const mutations = {
  setDoctors(state, value) {
    state.doctors = value;
  }
}
const actions = {
  async fetchDoctors({
    commit
  }) {

    const db = getFirestore();
    const docRef = doc(db, "Typen", "l0vUmzsNeMYKENhMx49w");
    const docSnap = await getDoc(docRef);

    console.log("getting")

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().doctors);
      var doctors = []
      if (docSnap.data().doctors) {
        docSnap.data().doctors.forEach(async doctor => {
          const doctorRef = doc(db, "Nutzer", doctor);
          const doctorSnap = await getDoc(doctorRef);
          if (doctorSnap.exists()) {
            doctors.push(doctorSnap.data())
          }
        });
      }
      commit("setDoctors", doctors);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      commit("setDoctors", []);
    }
  },
}
const getters = {
  getDoctors(state) {
    return state.doctors
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}