import {
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL
} from "firebase/storage";
const state = {
  doctors: [],
  ownDoctors: [],
}
const mutations = {
  setDoctors(state, value) {
    state.doctors = value;
  },
  setOwnDoctors(state, value) {
    state.ownDoctors = value;
  }
}
const actions = {
  async fetchDoctors({
    commit
  }) {

    const db = getFirestore();
    const docRef = doc(db, "Typen", "l0vUmzsNeMYKENhMx49w");
    const docSnap = await getDoc(docRef);

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
  async fetchOwnDoctors({
    commit
  }, uid) {
    const db = getFirestore();
    const docRef = doc(db, "Nutzer", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().doctors);
      var doctors = []
      if (docSnap.data().doctors) {
        docSnap.data().doctors.forEach(async doctor => {
          const doctorRef = doc(db, "Nutzer", doctor);
          const doctorSnap = await getDoc(doctorRef);
          if (doctorSnap.exists()) {
            var newDoctor = doctorSnap.data()
            newDoctor.profileImageSrc = null
            doctors.push(newDoctor)
          }
        });
      }
      commit("setOwnDoctors", doctors);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      commit("setOwnDoctors", []);
    }
  },
  async loadOwnDoctorsImages({
    commit
  }, ownDoctors) {
    console.log(commit)
    const storage = getStorage();
    ownDoctors.forEach(async doctor => {
      if (doctor.profilePicture) {
        const imageRef = ref(storage, "/images/users/" + doctor.uid + "/" + doctor.profilePicture);

        // Get the download URL
        getDownloadURL(imageRef)
          .then((url) => {
            doctor.profileImageSrc = url
          })
          .catch((error) => {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
            switch (error.code) {
              case 'storage/object-not-found':
                // File doesn't exist
                break;
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
              case 'storage/canceled':
                // User canceled the upload
                break;

                // ...

              case 'storage/unknown':
                // Unknown error occurred, inspect the server response
                break;
            }
          });
      }
    })
  }
}
const getters = {
  getDoctors(state) {
    return state.doctors
  },
  getOwnDoctors(state) {
    return state.ownDoctors
  },
}

export default {
  state,
  mutations,
  actions,
  getters
}