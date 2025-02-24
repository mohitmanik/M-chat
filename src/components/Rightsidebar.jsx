import React, { useContext } from 'react'
import './Rightsidebar.css'
import assets from '../assets/assets'
import { logout } from '../config/firebase'
import { AppContext } from '../context/Appcontext'
const Rightsidebar = () => {


  const {userData,setUserData,chatdata,setchatdata,loaduserData,messages,setmessages,messageId,setMessageId,chatUser,setChatUser}  = useContext(AppContext);


  return chatUser ?(
   <div className="rs">
    <div className="rs-profile">
      <img src={chatUser ? chatUser.userData.avatar : ""} alt="" />
      <h3>{chatUser ? chatUser.userData.name: ""} {Date.now()-chatUser.userData.lastSeen<=70000?  <img className='dot' src={assets.green_dot} alt="" /> : null  }</h3>
      <p>{chatUser ? chatUser.userData.bio : ""}</p>
    </div>
    <hr />
    <div className="rs-media">
      <p>Media</p>
      <div>
        <img src={assets.pic1} alt="" />
        <img src={assets.pic1} alt="" />
        <img src={assets.pic1} alt="" />
        <img src={assets.pic1} alt="" />
        <img src={assets.pic1}alt="" />
        <img src={assets.pic1} alt="" />
      </div>
    </div>
    <button onClick={logout}>Logout</button>
   </div>
  ):

  <div className='rs'>
       <button onClick={()=>logout}>Logout</button>
  </div>
}

export default Rightsidebar
