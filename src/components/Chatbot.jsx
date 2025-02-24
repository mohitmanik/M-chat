import React, { useContext, useEffect, useId, useState } from 'react'
import './Chatbot.css'
import assets from '../assets/assets'
import { AppContext } from '../context/Appcontext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { toast } from 'react-toastify'
const Chatbot = () => {
const [input,setinput]  = useState("")

const {userData,setUserData,chatdata,setchatdata,loaduserData,messages,setmessages,messageId,setMessageId,chatUser,setChatUser} = useContext(AppContext)
 
const sendmessage = async () => {
  try {
    if (input && messageId) {
      const messageRef = doc(db, "messages", messageId);

      await updateDoc(messageRef, {
        messages: arrayUnion({
          sId: userData.id,
          text: input,
          createdAt: new Date(),
        }),
      });

      const userIDs = [chatUser.rId, userData.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "chats", id);
        const userChatSnapshot = await getDoc(userChatsRef);

        if (userChatSnapshot.exists()) {
          const userChatData = userChatSnapshot.data();
          const chatIndex = userChatData.chatsData.findIndex(
            (c) => c.messageId === messageId
          );

          if (chatIndex !== -1) {
            userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
            userChatData.chatsData[chatIndex].updatedAt = Date.now();

            if (userChatData.chatsData[chatIndex].rId === userData.id) {
              userChatData.chatsData[chatIndex].messageSeen = false;
            }

            await updateDoc(userChatsRef, {
              chatsData: userChatData.chatsData,
            });
          }
        }
      });
    } else {
      toast.error("Message cannot be empty!");
    }
  } catch (error) {
    toast.error(error.message);
  }

  setinput("");
};

const converttimestamp = (timestamp)=>{
  let date = timestamp.toDate(); 

  const hour = date.getHours() ; 
  const minute =date.getMinutes(); 

  if(hour>12){
    return hour-12+":"+minute+"PM"; 
  }else{
    return hour+":"+minute+"AM"; 
  }
}





useEffect(() => {
  if (messageId) {
    const unSub = onSnapshot(doc(db, "messages", messageId), (res) => {
      if (res.exists()) {
        setmessages(res.data().messages.reverse());
      } else {
        setmessages([]); // Prevent crashes if no messages exist
      }
    });

    return () => unSub();
  }
}, [messageId]); // Corrected dependency


  return chatUser ? (
 
   <div className="chat-box">
    <div className="chat-user">
      <img src={chatUser.userData.avatar} alt="" />
      <p>{chatUser.userData.name}
        
        {Date.now()-chatUser.userData.lastSeen<=70000?  <img className='dot' src={assets.green_dot} alt="" /> : null  }
        </p>

      <img src={assets.help_icon} alt="" />
    </div>


    <div className="chat-msg">
  {messages.length > 0 ? (
    messages.map((msg, index) => (
      <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>
        <p className="msg">{msg.text}</p>
        <div>
          <img
            src={
              msg.sId === userData.id
                ? userData.avatar
                : chatUser.userData.avatar
            }
            alt=""
          />
          <p>{converttimestamp(msg.createdAt)}</p>
        </div>
      </div>
    ))
  ) : (
    <p>No messages yet.</p>
  )}
</div>


    <div className="chat-input">
      <input onChange={(e)=>setinput(e.target.value)} value={input} type="text" placeholder='Send a message' />
      <input type="file" id='image' accept='image/png, image/jpeg' hidden />
      <label htmlFor="image">
        <img src={assets.gallery_icon} alt="" />
      </label>
      <img onClick={sendmessage} src={assets.send_button} alt="" />
    </div>

   </div>
  ):
  <div className='chat-welcome'>
   <img src= {assets.logo_icon} alt="" />
    <p>Chat anytime,anywhere </p>
  </div>
}

export default Chatbot
