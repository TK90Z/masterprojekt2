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
      ownPatients.forEach(async patient =>{
        console.log(state.ownPatients)
        if(patient.profilePicture){
        const imageRef = ref(storage, "/images/users/" + patient.uid + "/" + patient.profilePicture);

        // Get the download URL
        getDownloadURL(imageRef)
            .then((url) => {
                patient.profileImageSrc = url
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