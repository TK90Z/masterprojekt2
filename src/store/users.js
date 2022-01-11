import {
    collection,
    getDocs,
    getFirestore,
    updateDoc,
    doc,
    arrayUnion,
    arrayRemove,
    deleteDoc,
    deleteField,
    getDoc
} from "firebase/firestore";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "firebase/storage";
const state = {
    users: [],
    profilePicture: null
}
const mutations = {
    setUsers(state, value) {
        state.users = value;
    },
    setProfilePicture(state, value) {
        state.profilePicture = value;
    },
}
const actions = {
    async uploadProfilePicture({
        dispatch
    }, data) {

        console.log(data)
        const storage = getStorage();

        const path = 'images/users/' + data.uid + "/" + data.picture.name

        const mountainImagesRef = ref(storage, path);

        uploadBytes(mountainImagesRef, data.picture).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            console.log(snapshot);
            dispatch("updateUserProfilePicture", {
                uid: data.uid,
                name: data.picture.name
            });
        });
    },
    async updateUserProfilePicture({
        dispatch
    }, data) {
        const db = getFirestore();
        const userRef = doc(db, "Nutzer", data.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            await updateDoc(userRef, {
                profilePicture: data.name
            });
            dispatch("loadUserProfilePicture", data.uid)
        }
    },
    async loadUserProfilePicture({
        commit
    }, uid) {

        var name = ""

        const db = getFirestore();
        const userRef = doc(db, "Nutzer", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            name = userSnap.data().profilePicture
        }

        const fileName = "images/users/" + uid + "/" + name

        const storage = getStorage();
        const starsRef = ref(storage, fileName);

        // Get the download URL
        getDownloadURL(starsRef)
            .then((url) => {
                commit("setProfilePicture", url)
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
    },
    async fetchUsers({
        commit
    }) {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "Nutzer"));

        var users = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            var user = doc.data()
            user.editMode = false
            user.editName = doc.data().name
            user.editRights = doc.data().rights
            user.subjectArea = doc.data().subjectArea
            console.log(user);
            users.push(user)
        });
        commit("setUsers", users);
    },
    async updateUser({
        dispatch
    }, user) {
        const db = getFirestore();
        const userRef = doc(db, "Nutzer", user.uid);
        if (user.rights == 2) {
            await updateDoc(userRef, {
                name: user.name,
                rights: user.rights,
                subjectArea: user.subjectArea
            });
        } else {
            await updateDoc(userRef, {
                name: user.name,
                rights: user.rights,
                subjectArea: deleteField()
            });
        }

        dispatch("fetchUsers")
        const patientRef = doc(db, "Typen", "qiL18SAnqonCvvcL17s8");
        await updateDoc(patientRef, {
            patients: arrayRemove(user.uid),
        });
        const doctorRef = doc(db, "Typen", "l0vUmzsNeMYKENhMx49w");
        await updateDoc(doctorRef, {
            doctors: arrayRemove(user.uid),
        });
        if (user.rights == 1) {
            await updateDoc(patientRef, {
                patients: arrayUnion(user.uid)
            });
        }
        if (user.rights == 2) {
            await updateDoc(doctorRef, {
                doctors: arrayUnion(user.uid)
            });
        }
    },
    async deleteUser({
        dispatch
    }, uid) {
        const db = getFirestore();
        dispatch("fetchUsers")
        await deleteDoc(doc(db, "Nutzer", uid));
        const patientRef = doc(db, "Typen", "qiL18SAnqonCvvcL17s8");
        await updateDoc(patientRef, {
            patients: arrayRemove(uid),
        });
        const doctorRef = doc(db, "Typen", "l0vUmzsNeMYKENhMx49w");
        await updateDoc(doctorRef, {
            doctors: arrayRemove(uid),
        });
    }
}
const getters = {
    getUsers(state) {
        return state.users
    },
    getProfilePicture(state) {
        return state.profilePicture
    },
}

export default {
    state,
    mutations,
    actions,
    getters
}