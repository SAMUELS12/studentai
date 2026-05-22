import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA8m_ga82B4OHageUHyuChFES7lLDqJPS0",
  authDomain: "studyai-ca3b7.firebaseapp.com",
  projectId: "studyai-ca3b7",
  storageBucket: "studyai-ca3b7.firebasestorage.app",
  messagingSenderId: "37089603077",
  appId: "1:37089603077:web:9ecd1d9e2a5b8ed0f2366c"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

try {
  enableIndexedDbPersistence(db)
} catch {}
