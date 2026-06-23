import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Track Auth State Globally
onAuthStateChanged(auth, async (user) => {
    const userBtn = document.getElementById('user-btn');
    if (user) {
        // User is signed in
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        
        // Update nav icon to show logged in state or redirect to profile
        if(userBtn) userBtn.href = "profile.html";
        
        // Admin redirect logic (if on an admin page)
        if(userData?.role === 'admin' && window.location.pathname.includes('admin')) {
            // allow access
        }
    } else {
        // User is signed out
        if(userBtn) userBtn.href = "login.html";
    }
});

// Registration Logic
export const registerUser = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            role: "customer",
            address: "",
            createdAt: new Date().toISOString()
        });
        
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error during registration:", error.message);
        alert(error.message);
    }
};

// Login Logic
export const loginUser = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error during login:", error.message);
        alert("Invalid credentials. Please try again.");
    }
};

// Logout Logic
export const logoutUser = async () => {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Error signing out:", error);
    }
};
