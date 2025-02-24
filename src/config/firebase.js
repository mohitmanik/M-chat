// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, setDoc, doc, query, where,collection, getDoc, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

// Firebase configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Auth
const db = getFirestore(app); // Initialize Firestore

// Signup function
const signup = async (username, email, password) => {
  try {
    // Create user
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Store user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, there! I am using chat app",
      lastSeen: Date.now(),
    });

    // Initialize empty chat data for the user
    await setDoc(doc(db, "chats", user.uid), {
      chatsData: [],
    });

    toast.success("User registered successfully!");
  } catch (error) {
    console.error("Signup Error:", error);
    toast.error(error.code);
  }
};


const login = async (email,password) =>{
    try{
       await signInWithEmailAndPassword(auth,email,password); 
       toast.success("User Signed In successfully!");

    }
    catch(error){
        console.log(error); 
        toast.error(error.code); 
    }
}

const logout = async ()=>{

    try{
        await  signOut(auth);
        toast.success("User Singed Out successfully!");
    }catch{
        console.log(error); 
        toast.error(error.code); 
    }
   
}



const resetpass  = async (email)=>{
  if(!email){
    toast.error("Enter your Email"); 
    return null; 
  }

  try{

    const userRef = collection(db,"users"); 
    const q = query(userRef,where("email","==",email));
    const querySnap  = await getDocs(q) ;
    
    if(!querySnap.empty){
      await sendPasswordResetEmail(auth,email); 
      toast.success("Reset Email Sent"); 
    }else{
      toast.error("Email doesn't exists")
    }
  }
  catch(error){
    console.error(error);
    toast.error(error.message)
  }
}
export { signup,login ,logout,auth,db,resetpass};
