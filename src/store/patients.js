import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import {
  getStorage,
  ref,
  getDownloadURL
} from "firebase/storage";
const state = {
  patients: [],
  ownPatients: [],
}
const mutations = {
  setPatients(state, value) {
    state.patients = value;
  },
  setOwnPatients(state, value) {
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
            var newPatient = patientSnap.data()
            newPatient.profileImageSrc = null
            patients.push(newPatient)
          }
        });
      }
      commit("setOwnPatients", patients);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      commit("setOwnPatients", []);
    }
  },
  async loadOwnPatientsImages({
    commit
  }, ownPatients) {
    console.log(commit)
    const storage = getStorage();
    ownPatients.forEach(async patient => {
      console.log(state.ownPatients)
      if (patient.profilePicture) {
        const imageRef = ref(storage, "/images/users/" + patient.uid + "/" + patient.profilePicture);

        // Get the download URL
        getDownloadURL(imageRef)
          .then((url) => {
            patient.profileImageSrc = url
          })
          .catch((error) => {
            patient.profileImageSrc = "data:image/jpeg;base64,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"
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
      } else {
        patient.profileImageSrc = "data:image/jpeg;base64,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"
      }
    })
  },
  async addNewDiagnosis({
    getters
  }, data) {
    getters.getDoc
    const db = getFirestore();
    const userRef = doc(db, "Nutzer", data.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        diagnosis: arrayUnion(data.newDiagnosis)
      });
    }
  },
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