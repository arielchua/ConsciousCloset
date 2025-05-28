import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDYvq6jPOKFpx0pT_obxrSJbk_trUNPiuM",
  authDomain: "consciouscloset-23524.firebaseapp.com",
  projectId: "consciouscloset-23524",
  storageBucket: "consciouscloset-23524.appspot.com",
  messagingSenderId: "",
  appId: "",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);