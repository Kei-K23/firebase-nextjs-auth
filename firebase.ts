import { initializeApp } from "firebase/app";
import { firebaseClientConfig } from "./firebase-config";

export const app = initializeApp(firebaseClientConfig);
