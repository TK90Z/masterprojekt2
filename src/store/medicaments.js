import {
    getStorage,
    ref,
    uploadBytes,
    deleteObject,
    getDownloadURL
} from "firebase/storage";
const state = {

}
const mutations = {

}
const actions = {
    uploadImage({
        commit
    }, file) {
        console.log(commit)
        const storage = getStorage();

        const mountainImagesRef = ref(storage, 'images/medicaments/mountains.jpg');

        uploadBytes(mountainImagesRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            console.log(snapshot)
        });
    },
    loadImage({
        commit
    }, fileName) {
        console.log(commit)
        const storage = getStorage();
        const starsRef = ref(storage, fileName);

        // Get the download URL
        getDownloadURL(starsRef)
            .then((url) => {
                return url
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
    deleteImage({
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

}

export default {
    state,
    mutations,
    actions,
    getters
}