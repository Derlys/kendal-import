import {cert, getApp, getApps, initializeApp, ServiceAccount} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount: ServiceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
};
const adminApp = !getApps().length
    ? initializeApp({ credential: cert(serviceAccount) })
    : getApp();
export const adminDb = getFirestore(adminApp);
