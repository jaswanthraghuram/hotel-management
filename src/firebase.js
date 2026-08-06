import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0UeRNryDRwwfnFcLxLimM6r27GWXSXQ0",
  authDomain: "hotelmanagement-a6bee.firebaseapp.com",
  projectId: "hotelmanagement-a6bee",
  storageBucket: "hotelmanagement-a6bee.firebasestorage.app",
  messagingSenderId: "961916722698",
  appId: "1:961916722698:web:d652607a484b4e4f19c9f3",
  measurementId: "G-ZD8VMCNDPC"
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(app)

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider()

export default app
