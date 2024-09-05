import { app } from "@/firebase";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(getAuth(app), provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken;
    const idToken = credential?.idToken;

    await fetch("/api/login", {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  } catch (error) {
    throw error;
  }
}
export async function signInWithEmailAndPass(email: string, password: string) {
  try {
    const credential = await signInWithEmailAndPassword(
      getAuth(app),
      email,
      password
    );
    const idToken = await credential.user.getIdToken();

    await fetch("/api/login", {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  } catch (error) {
    throw error;
  }
}
export async function signOutUser() {
  try {
    await signOut(getAuth(app));
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Sign-out error:", error);
  }
}
