import { app } from "@/firebase";
import { serverConfig } from "@/firebase-config";
import {
  getAuth,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import Cookies from "js-cookie";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    // Redirect the user to Google for authentication
    const result = await signInWithPopup(getAuth(app), provider);

    if (result) {
      const idToken = await result.user.getIdToken();

      // Send the ID token to your backend
      await fetch("/api/login", {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      // Define the cookie options supported by js-cookie
      const cookieOptions = {
        path: serverConfig.cookieSerializeOptions.path,
        expires: serverConfig.cookieSerializeOptions.maxAge
          ? serverConfig.cookieSerializeOptions.maxAge / (60 * 60 * 24)
          : undefined,
        secure: serverConfig.cookieSerializeOptions.secure,
        sameSite: serverConfig.cookieSerializeOptions.sameSite,
      };

      // Set the cookie
      Cookies.set(serverConfig.cookieName, idToken, cookieOptions);
    }
  } catch (error) {
    console.log("ERROR: ", error);
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
    const googleCredential =
      GoogleAuthProvider.credentialFromResult(credential);

    const user = credential.user;
    const idToken = await credential.user.getIdToken();

    if (googleCredential != null) {
      await linkWithCredential(user, googleCredential);
    }

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
