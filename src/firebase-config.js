
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig  = {
  apiKey: "AIzaSyA5mAhHGAcSjO9TQ2bbtljMH8yv7XzDjOA",
  authDomain: "pranamayur-wellness.firebaseapp.com",
  projectId: "pranamayur-wellness",
  storageBucket: "pranamayur-wellness.firebasestorage.app",
  messagingSenderId: "316571652325",
  appId: "1:316571652325:web:c1b527f2690d9aa6c2840c"
};
// 1. Initialize the app
const app = initializeApp(firebaseConfig);

// 2. Export 'db' so Services.jsx can see it
export const db = getFirestore(app);


export default app;