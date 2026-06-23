import { auth, db } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Monitor Auth State
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if(userDoc.exists() && userDoc.data().role === 'admin') {
            localStorage.setItem('isAdmin', 'true');
        }
    } else {
        localStorage.removeItem('isAdmin');
    }
});

export const registerUser = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user profile in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            role: "customer",
            createdAt: new Date().toISOString()
        });
        return user;
    } catch (error) {
        console.error("Registration Error:", error.message);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Login Error:", error.message);
        throw error;
    }
};

export const logoutUser = () => signOut(auth);
