import {
    collection,
    getDocs,
    getFirestore,
    updateDoc,
    doc,
    arrayUnion,
    arrayRemove
} from "firebase/firestore";
const state = {
    users: []
}
const mutations = {
    setUsers(state, value) {
        state.users = value;
    }
}
const actions = {
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
            user.editRights = doc.data().rights
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
        await updateDoc(userRef, {
            name: user.name,
            rights: user.rights
        });
        dispatch("fetchUsers")
        const patientRef = doc(db, "Typen", "qiL18SAnqonCvvcL17s8");
        await updateDoc(patientRef, {
            patients: arrayRemove(user.uid),
        });
        const doctorRef = doc(db, "Typen", "l0vUmzsNeMYKENhMx49w");
        await updateDoc(doctorRef, {
            doctors: arrayRemove(user.uid),
        });
        if(user.rights == 1) {
            await updateDoc(patientRef, {
                patients: arrayUnion(user.uid)
            });
        }
        if(user.rights == 2) {
            await updateDoc(doctorRef, {
                doctors: arrayUnion(user.uid)
            });
        }
    },
}
const getters = {
    getUsers(state) {
        return state.users
    },
}

export default {
    state,
    mutations,
    actions,
    getters
}