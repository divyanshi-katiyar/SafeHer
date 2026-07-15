import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCz5hStlrNew042p9DserWs70Hq_2X8mQ8",
  authDomain: "cryptic-iterator-m6rpq.firebaseapp.com",
  projectId: "cryptic-iterator-m6rpq",
  storageBucket: "cryptic-iterator-m6rpq.firebasestorage.app",
  messagingSenderId: "1069439407547",
  appId: "1:1069439407547:web:423dc89c9b7c1c8247609e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-0baa5280-9099-45db-b59a-64d6aa58457b");
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Validate Connection to Firestore as per SKILL guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration: client is offline.");
    } else {
      console.log("Firebase connection test complete (it is normal if 'test/connection' doc does not exist).");
    }
  }
}

testConnection();
