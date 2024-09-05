import { firebaseClientConfig, serverConfig } from "@/firebase-config";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import HomePage from "./_components/HomePage";

export default async function Home() {
  const tokens = await getTokens(cookies(), {
    apiKey: firebaseClientConfig.apiKey!,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    notFound();
  }

  return <HomePage email={tokens?.decodedToken.email} />;
}
