import {
    collection,
    getDocs,
    getFirestore,
    updateDoc,
    doc
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