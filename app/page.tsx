import { firebaseClientConfig, serverConfig } from "@/firebase-config";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-xl mb-4">Super secure home page</h1>
      <p>
        Only <strong>{tokens?.decodedToken.email}</strong> holds the magic key
        to this kingdom!
      </p>
    </main>
  );
}
