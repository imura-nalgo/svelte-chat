import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, ref, type Database, type DatabaseReference, push } from "firebase/database";
import dayjs from "dayjs";
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';

import type { Message, Sender } from "$interfaces/message";

export let app: FirebaseApp | null = null;
export let db: Database | null = null;
export let dbRef: DatabaseReference | null = null;
export let auth: Auth | null = null;

export async function initFirebaseApp() {
  if (getApps().length !== 0) {
    console.log('Firebase app already initialized.');
    return;
  }
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID
  };
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getDatabase(app);
  dbRef = ref(db, 'chat');
}

export const sendMessage = async (text: string, sender: Sender) => {
  if (dbRef === null) {
    return;
  }

  const message: Message = {
    text: text,
    sent_at: dayjs().format(),
    sender: sender
  };

  await push(dbRef, message);
}