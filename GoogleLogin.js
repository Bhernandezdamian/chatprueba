import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithRedirect, signInWithPopup, getRedirectResult, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCgEaSuwHG0Qf3QCxjvk68U1RkoWIKMqmE",
    authDomain: "chat-3dcc7.firebaseapp.com",
    projectId: "chat-3dcc7",
    storageBucket: "chat-3dcc7.appspot.com",
    messagingSenderId: "25904698660",
    appId: "1:25904698660:web:ad783930fd62e27134cfb1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth();

document.getElementById("googleLogin").addEventListener("click", () => {
    signInWithRedirect(auth, provider);
});

getRedirectResult(auth)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
