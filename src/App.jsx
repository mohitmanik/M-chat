import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import { Routes,Route, useNavigate } from 'react-router-dom'

import './App.css'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AppContext } from './context/Appcontext'
function App() {

   const navigate  = useNavigate(); 
   const {loaduserData} = useContext(AppContext); 



   useEffect(()=>{
    onAuthStateChanged(auth,async (user)=>{
      if(user){
         navigate('/chat'); 
         await loaduserData(user.uid); 
      }else{
        navigate('/'); 
      }
    })
   },[])

  return (
    <>

     <ToastContainer/>
      <Routes>
         <Route path='/' element = {<Login/>}/>
         <Route path='/chat' element = {<Chat/>}/>
         <Route path='/profile' element = {<ProfileUpdate/>}/>
      </Routes>
    </>
  )
}

export default App
