import {
    addDoc,
    getFirestore,
    collection,
    updateDoc,
    doc,
    getDoc,
    getDocs
} from "firebase/firestore";
import {
    getStorage,
    ref,
    uploadBytes,
    deleteObject,
    getDownloadURL,
} from "firebase/storage";
const state = {
    medicaments: [],
    myMedicaments: []
}
const mutations = {
    setMedicaments(state, value) {
        state.medicaments = value;
    },
    setMyMedicaments(state, value) {
        state.myMedicaments = value;
    },
}
const actions = {
    async readMedicaments({
        dispatch
    }, file) {
        getters.getMedicaments
        let reader = new FileReader();
        reader.onload = e => {
            let json = JSON.parse(e.target.result);
            dispatch("uploadMedicament", {
                json: json,
                image: file.image
            })
        };
        reader.readAsText(file.json);
    },
    async uploadMedicament({
        dispatch
    }, file) {
        const db = getFirestore();
        const medicationRef = await addDoc(collection(db, "Medikamente"), file.json);
        dispatch("uploadMedicamentPicture", {
            id: medicationRef.id,
            image: file.image
        })
    },
    async uploadMedicamentPicture({
        dispatch
    }, data) {
        const storage = getStorage();

        const name = "picture." + data.image.name.substring(data.image.name.lastIndexOf('.') + 1, data.image.name.length) || data.image.name;

        const path = 'images/medicaments/' + data.id + "/" + name

        const mountainImagesRef = ref(storage, path);

        uploadBytes(mountainImagesRef, data.image).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            console.log(snapshot);
        });
        dispatch("updateMedicamentPicture", {
            name: name,
            id: data.id
        })
    },
    async updateMedicamentPicture({
        getters
    }, data) {
        getters.getMedicaments
        const db = getFirestore();
        const medicationRef = doc(db, "Medikamente", data.id);
        const medicationSnap = await getDoc(medicationRef);
        if (medicationSnap.exists()) {
            await updateDoc(medicationRef, {
                id: medicationRef.id,
                picture: data.name
            });
        }
    },
    async fetchMedicaments({
        commit
    }) {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "Medikamente"));

        var medicaments = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            var medicament = doc.data()
            medicament.profileImageSrc = null
            console.log(medicament);
            medicaments.push(medicament)
        });
        commit("setMedicaments", medicaments);
    },
    async fetchMyMedicaments({
        commit
    }, uid) {
        const db = getFirestore();

        const userRef = doc(db, "Nutzer", uid);
        const userSnap = await getDoc(userRef);

        var myMeds = []

        if (userSnap.exists()) {
            if (userSnap.data().diagnosis) {
                userSnap.data().diagnosis.forEach(async element => {
                    element.medications.forEach(async med => {
                        const medRef = doc(db, "Medikamente", med.id);
                        const medSnap = await getDoc(medRef);

                        if (medSnap.exists()) {
                            med.data = medSnap.data()
                            med.picture = medSnap.data().picture
                        }
                        med.profileImageSrc = null
                        myMeds.push(med)
                    })
                })
            }
        }
        commit("setMyMedicaments", myMeds);
    },
    async loadMedicamentsImages({
        commit
    }, medicaments) {
        console.log(commit)
        const storage = getStorage();
        medicaments.forEach(async medicament => {
            if (medicament.picture) {
                const imageRef = ref(storage, "/images/medicaments/" + medicament.id + "/" + medicament.picture);

                // Get the download URL
                getDownloadURL(imageRef)
                    .then((url) => {
                        medicament.profileImageSrc = url
                    })
                    .catch((error) => {
                        medicament.profileImageSrc = "data:image/jpeg;base64,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"
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
                medicament.profileImageSrc = "data:image/jpeg;base64,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"
            }
        })
    },
    async deleteImage({
        commit
    }, fileName) {
        console.log(commit)
        const storage = getStorage();

        const desertRef = ref(storage, fileName);

        // Delete the file
        deleteObject(desertRef).then(() => {
            // File deleted successfully
        }).catch((error) => {
            console.log(error)
        });
    }
}
const getters = {
    getMedicaments(state) {
        return state.medicaments
    },
    getMyMedicaments(state) {
        return state.myMedicaments
    },
}

export default {
    state,
    mutations,
    actions,
    getters
}