import { doc, getDoc } from "firebase/firestore";
import { FC, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Auth, Firestore as fs } from "../../firebase.config";
import { UserState } from "../app";

import './user.style.css'

interface UserPageProps { isMe?: boolean }

const User: FC<UserPageProps> = ({ isMe }) => {
   let user = useContext(UserState);
   let navigate = useNavigate();
   
   useEffect(
      () => {
         // Handles going to login/register page when attempting to go to /me without auth
         if (isMe) {
            if (user !== 'loading') {
               if (!user) navigate('../../login');
            }
         }
      }, [isMe, user, navigate]
   );

   /** STATES: user exists | loading |  no user
    * 1. no user => go to login ✔
    * 2. there is a user
    *    a. its me => u can edit
    *    b. its not me => just preview
    */

   if (user) {

      // For when its loading
      let emptyUser: myUser = {
         pic: 1,
         uid: 'none',
         username: '',
         verified: false
      }

      let u = user === 'loading' ? emptyUser : user;

      return <div className="user-ctn">
         <div className="user-header">
            <div className={`user-pic ${ user === 'loading' ? 'user-pic-loading' : ''}`}>

            </div>
            <div className={`user-name ${ user === 'loading' ? 'user-name-loading' : ''}`}>
               { u.username }
            </div>
         </div>
         <div className={`user-bio`}>
            {
               user === 'loading' ? <div className={`user-bio-loading`}>
                  <div className="bio-loading-text"/>
                  <div className="bio-loading-text"/>
                  <div className="bio-loading-text"/>
               </div> : u.bio ? <> {u.bio} </> : <> {/* TODO: do something xd */} </>
            }
         </div>
         <div className={`socials ${ user === 'loading' ? 'socials-loading' : ''}`}>

         </div>
      </div>
   } else {
      return <></>
   }

}

export default User;