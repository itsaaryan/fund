import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJTohcc8bAPkCl4oPPJpVfu7zas6bvyaE",
  authDomain: "fund-it-9db5e.firebaseapp.com",
  projectId: "fund-it-9db5e",
  storageBucket: "fund-it-9db5e.appspot.com",
  messagingSenderId: "1003191800988",
  appId: "1:1003191800988:web:2f573aca86d16e4cb34959",
  measurementId: "G-RQZYC1LXW0",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.firestore();
}

// export const googleprovider = new firebase.auth.GoogleAuthProvider();
// export const facebookprovider = new firebase.auth.FacebookAuthProvider();
// export const twitterprovider = new firebase.auth.TwitterAuthProvider();
// export const githubprovider = new firebase.auth.GithubAuthProvider();

export default firebase;
