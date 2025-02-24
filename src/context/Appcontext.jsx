
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
export const AppContext  = createContext(); 

const AppcontextProvider = (props) =>{
    const navigate = useNavigate(); 

    const [userData , setUserData] = useState(null); 
    const [chatdata , setchatdata] = useState(null);
    const [messageId,setMessageId] = useState(null);
    const [messages,setmessages] = useState([]); 
    const [chatUser,setChatUser] = useState(null)
 
       const loaduserData = async(uid) =>{
        try{ 
            const userRef = doc(db,"users",uid); 
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data(); 
             setUserData(userData);
             
             if(userData.name){
               navigate('/chat'); 
             }else{
              navigate('/profile')
             }

            await updateDoc(userRef,{
              lastSeen:Date.now() 
            })
            setInterval(async() => {
              if(auth.chatUser){
                await updateDoc(userRef,{
                  lastSeen:Date.now()
                })
              }
            }, 60000);
        }catch(error){
           console.error(error.code) 
        }
       }




       useEffect(() => {
        if (userData) {
          const chatRef = doc(db, "chats", userData.id);
      
          const unSub = onSnapshot(chatRef, async (res) => {
            if (!res.exists()) {
              console.warn("Chat document does not exist for user:", userData.id);
              setchatdata([]); // Set empty array if no document found
              return;
            }
      
            const chatItems = res.data()?.chatsData || []; // Handle undefined `chatsData`
            const tempdata = [];
      
            for (const item of chatItems) {
              try {
                const userRef = doc(db, "users", item.rId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  const userData = userSnap.data();
                  tempdata.push({ ...item, userData });
                } else {
                  console.warn("User document does not exist for rId:", item.rId);
                }
              } catch (error) {
                console.error("Error fetching user data:", error);
              }
            }
      
            setchatdata(tempdata.sort((a, b) => b.updatedAt - a.updatedAt));
          });
      
          return () => {
            unSub();
          };
        }
      }, [userData]);
      
    const value = {
  userData,setUserData,chatdata,setchatdata,loaduserData,messages,setmessages,messageId,setMessageId,chatUser,setChatUser
    }


    return (
        <AppContext.Provider value={value}>
          {props.children}
        </AppContext.Provider>
    )
}

export default AppcontextProvider; 