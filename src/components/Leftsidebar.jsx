import React, { useContext, useState } from 'react';
import { arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase'; // Assuming db is exported from your firebase config
import assets from '../assets/assets';
import './Leftsidebar.css';
import { useNavigate } from 'react-router-dom';
import { logout } from '../config/firebase';
import { toast } from 'react-toastify';
import { collection, getDocs, query } from 'firebase/firestore';
import { AppContext } from '../context/Appcontext';

const Leftsidebar = () => {
  const { userData, chatdata,messages,setmessages,messageId,setMessageId,chatUser,setChatUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputhandler = async (e) => {
    try {
      const input = e.target.value;

      if (input) {
        const userRef = collection(db, "users");
        const q = query(userRef, where("name", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        setShowSearch(true);

        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false;
          (chatdata || []).map((user) => {
            if (user.rId === querySnap.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        } else {
          setUser(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addChat = async () => {
    const messageRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: []
      });
      await updateDoc(doc(chatsRef, user.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });
      await updateDoc(doc(chatsRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });
    } catch (error) {
      toast.error(error.message);
    }
  };
  const setChat = async (item)=>{
    setMessageId(item.messageId);
    setChatUser(item);
const userChatsRef = doc(db, "chats", userData.id);
        const userChatSnapshot = await getDoc(userChatsRef);
        
          const userChatData = userChatSnapshot.data();
          const chatIndex = userChatData.chatsData.findIndex(
            (c) => c.messageId === messageId
          );
userChatData.chatData[chatIndex].messageSeen = true; 
  await updateDoc(userChatsRef, {
               chatsData: userChatData.chatsData,
             });
  }
  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} alt="" className='logo' />
          <div className="menu">
            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">
              <p onClick={() => { navigate('/profile') }}>Edit Profile</p>
              <hr />
              <p onClick={() => logout()}>Logout</p>
            </div>
          </div>
        </div>

        <div className="ls-search">
          <img src={assets.search_icon} alt="" />
          <input onChange={inputhandler} type="text" placeholder='Search here' />
        </div>
      </div>

      <div className="ls-list">
        {showSearch && user ? (
          <div onClick={addChat} className="friends add-user" >
            <img src={user.avatar} alt="" />
            <p>{user.name}</p>
          </div>
        ) : (
          (chatdata || []).map((item, index) => (
            <div  onClick={()=>setChat(item)} key={index} className={`friends ${item.messageSeen|| item.messageId==messageId ?"": "border" }`}>
              <img src={item.userData?.avatar} alt="" />
              <div>
                <p>{item.userData?.name}</p>
                <span>{item.lastMessage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leftsidebar; 