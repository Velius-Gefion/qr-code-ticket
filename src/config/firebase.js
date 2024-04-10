import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDeFqynTlF2l4DgGv1zsBx8RZPgFy4OzXM",
  authDomain: "sei-qr-code-ticket.firebaseapp.com",
  projectId: "sei-qr-code-ticket",
  storageBucket: "sei-qr-code-ticket.appspot.com",
  messagingSenderId: "21372147762",
  appId: "1:21372147762:web:9f702f5a18753372a1842b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);    