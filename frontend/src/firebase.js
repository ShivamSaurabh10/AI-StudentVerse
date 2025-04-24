import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDm8UQSK6w9cAwm1Snp28MHad-5lFKvk4U",
    authDomain: "ai-conversation-5bf34.firebaseapp.com",
    projectId: "ai-conversation-5bf34",
    storageBucket: "ai-conversation-5bf34.appspot.com",
    messagingSenderId: "763589953660",
    appId: "1:763589953660:web:27c6efb7afc0364bf321f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export { auth, googleProvider }; 