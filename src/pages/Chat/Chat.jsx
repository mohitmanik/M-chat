import React, { useContext, useDebugValue, useEffect, useState } from 'react'
import "./Chat.css"
import Leftsidebar from '../../components/Leftsidebar'
import Rightsidebar from '../../components/Rightsidebar'
import Chatbot from '../../components/chatbot'
import { AppContext } from '../../context/Appcontext'
const Chat = () => {
  
   
  const {chatdata,userData} = useContext(AppContext); 
   
  const [loading,setloading] = useState(true); 

  useEffect(()=>{
    if(chatdata&&userData){
      setloading(false)
    }
  },[chatdata,userData])

  return (
<div className="chat">
 {
  loading?<p className='loading'>Loading...</p>:
  <div className="chat-container">
  <Leftsidebar/>
   <Chatbot/>
  <Rightsidebar/>
</div>
 }

</div>

  )
}

export default Chat
