import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import { login, signup ,resetpass} from '../../config/firebase'
signup
const Login = () => {

    const [currstate , setstate] = useState("Sign Up"); 
    const [userName , setUsername]  = useState(""); 
    const [email,setemail] = useState(""); 
    const [password,setpassword] = useState(""); 

    const change = (e) =>{
          if(currstate == "Sign Up"){
            setstate("Login"); 
          }else{
            setstate("Sign Up"); 
          }
    }

    const onsubmithandler = (event) =>{
      event.preventDefault(); 
      if(currstate==="Sign Up"){
        signup(userName,email,password); 
      }else{
        login(email,password); 
      }
    }
  return (
    <>
    <div className="login ">
     {/* <img src={assets.logo_big} alt="" className='logo ' /> */}

    <form onSubmit={onsubmithandler} className='login-form' action="">

    <h2>{currstate}</h2>

    {currstate== "Sign Up" &&  <input type="text" onChange={(e)=>setUsername(e.target.value)} value={userName} placeholder='username' className='form-input' required />}
   
    <input onChange={(e)=>setemail(e.target.value)} value={email} type="email" placeholder='Email address' className='form-input' required />
    <input onChange={(e)=>setpassword(e.target.value)} value ={password}type="password" placeholder='password' className='form-input' required />
    <button type='submit'> {currstate}</button>

     <div className="login-term">
        <input type="checkbox" />
        <p>Agree to the terms of use & privacy policy.</p>
     </div>
    <div className="login-forgot">
      {currstate =="Sign Up" && <p className='login-toggle'>Already have an account <span onClick={change}>click here</span></p> }  
      {currstate=="Login" &&<p className='login-toggle'>Don't have an account, Create one <span onClick={change}>click here</span></p> } 
     
      {currstate=="Login" &&<p className='login-toggle'>Forgot Password ?  <span onClick={()=>resetpass(email)}>reset here</span></p> }
     


    </div>
    </form>
    </div>
    </>
  )
}

export default Login
