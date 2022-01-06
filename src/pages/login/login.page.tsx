import React, { useContext, useEffect, useState } from "react";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import fireApp, { Auth, Firestore as fs } from "../../firebase.config";

import './login.style.css';
import { FirebaseError } from "firebase/app";

import { CgSpinner } from 'react-icons/cg';
import { useNavigate } from "react-router-dom";
import { UserState } from "../app";
import { fetchImgUrl } from "../../services/Storage";

type Mode = 'login' | 'register'
interface LoginProps { mode?: Mode };

const regText = "No account? ";
const logText = "Already have an account? ";

const Login: React.FC<LoginProps> = ({ mode: initMode = 'login' }) => {
   let userState = useContext(UserState);

   let [ mode, setMode ] = useState<Mode>(initMode);
   let [ email, setEmail ] = useState<string>('');
   let [ username, setUsername ] = useState<string>('');
   let [ password, setPassword ] = useState<string>('');
   let [ msg, setMsg ] = useState<string>('');
   let [ msgc, setMsgc ] = useState<'error' | 'succ'>('error');
   let [ loading, setLoading ] = useState<boolean>(false);  // For submitions

   let [ uLoading, setULoading ] = useState<boolean>(true); // For useState

   let navigate = useNavigate();

   const clearMsg = () => setMsg('');
   const toggleMsg = () => setMsgc('succ');
   const toggleMode = () => { setMode(mode === 'login' ? 'register' : 'login'); clearMsg(); };

   useEffect(
      () => {
         if (userState !== 'loading') {
            if (userState) {
               navigate('../me');
            }
            setULoading(false);
         }
      }, [userState, navigate]
   );

   const handleSubmit = async () => {
      clearMsg();
      setLoading(true);
      let exception = false;
      try {

         let fireUser: User;
         if (mode === 'register') {
            // TODO: validate username further
            if (!username || username === '') throw Error('Invalid username');
            fireUser = (await createUserWithEmailAndPassword(Auth, email, password)).user;
            await setDoc(
               doc(fs, 'users', fireUser.uid), 
               {
                  uid: fireUser.uid,
                  username: username,
                  verified: false,
                  pic: 1,
               }
            );
         } else {
            fireUser = (await signInWithEmailAndPassword(Auth, email, password)).user;
         }
      } catch (err) {
         exception = true;
         let message: string;
         if (err instanceof FirebaseError) {
            message = err.code.split(`/`)[1].replaceAll('-', ' ');  
         } else if (err instanceof Error) {
            message = err.message;
         } else {
            message = 'weird error'
         }
         setMsg(message);

      } finally {

         if (!exception) {
            toggleMsg();
            setMsg(
               mode === 'login' ?
                  `successful login!` :
                  `account created!`
            );
            setTimeout(navigate, 1000, '../me');
         }

         setLoading(false);
      }
   }

   if (uLoading) {
      return <div className="flex w-screen h-screen justify-center items-center">
         <CgSpinner className="user-loading"/>
      </div>
   } else {
      return <div className="login-ctn">
         <div className="flex flex-col justify-center">
            <div className="form-ctn">
               <div className="mode-title"> { mode[0].toLocaleUpperCase() + mode.slice(1) } </div>
               <div className="inputs">
                  <input placeholder="email" type="email" onChange={ (e) => { setEmail(e.target.value) } }></input>
                  {
                     (mode === 'register') ? 
                        <input placeholder="username" onChange={ (e) => { setUsername(e.target.value) } }></input> :
                        <></>
                  }
                  <input placeholder="password" type="password" onChange={ (e) => { setPassword(e.target.value) } }></input>
               </div>
               <div className="submit-btn" onClick={ handleSubmit }> submit </div>
               {
                  loading ?
                  <CgSpinner className="loading-icon"/> :
                  <div className={`msg text-${msgc}`}> { msg } </div>
               }
            </div>
            <div className="switch-ctn">
               <div className="switch-text">
                  {`${mode === 'login' ? logText : regText }`} 
                  <div className="switch-btn" onClick={ toggleMode }>  {`${mode === 'login' ? 'register' : 'login'}`}  </div>
               </div>
            </div>
         </div>
      </div>
   }

}

export default Login;