import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Firestore as fs } from "../../firebase.config";
import { UserState } from "../app";
import { AiFillEdit } from 'react-icons/ai';
import { CgSpinner } from 'react-icons/cg';
import { BsCheck } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md';

import './user.style.css'
import { isBioValid, isUsernameValid } from "../../util";
import ContentEditable from "react-contenteditable";
import { fetchImgUrl } from "../../services/Storage";
import { myUser, UserRef } from "../../types";

interface UserPageProps {  }

const User: FC<UserPageProps> = () => {
   let { userId } = useParams();
   let userState = useContext(UserState);
   let navigate = useNavigate();
   let location = useLocation();

   let [ canEdit, setCanEdit ] = useState<boolean>(false);
   let [ edited, setEdited ] = useState<boolean>(false);
   let [ updating, setUpdating ] = useState<boolean>(false);
   let [ statusMsgs, setStatusMsgs ] = useState<string[]>([]);
   let [ statusState, setStatusState ] = useState<'error' | 'success' | 'hint'>('hint');
   let [ user, setUser ] = useState<myUser | null | 'not found'>(null);

   let usernameInput = useRef<HTMLInputElement>(null);
   let bioInput = useRef<HTMLSpanElement>(null);

   let [ username, setUsername ] = useState<string>('');
   let [ bio, setBio ] = useState<string>('');
   let [ pic, setPic ] = useState<string | null>(null);

   let setUserValues = (u: myUser) => {
      setUsername(u.username);
      setBio(u.bio || '');

      fetchImgUrl(`pic_${u.pic}.png`).then( url => setPic(url) ); // TODO: error
   }
   
   // FOR FETCHING DATA AND SETTING CORRECT PERMISSION STATES
   useEffect(
      () => {
         if (userState !== 'loading') { // When are done loading user data into userState
            if (location.pathname.endsWith('me')) {   // /me
               if (userState) { // Logged in
                  setUser(userState);
                  setUserValues(userState);   // ! could introduce errors
                  setStatusMsgs(['click fields to edit ✏']);
                  setCanEdit(true);
               } else if (userState === null) { // not Logged in
                  navigate(`/login`, { replace: true })
               }
            } else { // /uid
               let fetchUser = async (id: string) => {
                  let userRef = doc(fs, 'users', id) as UserRef;
                  let userDoc = await getDoc<myUser>(userRef);

                  if (userDoc.exists()) {
                     setUser(userDoc.data());
                     setUserValues(userDoc.data());
                     setCanEdit(false);
                  } else {
                     setUser('not found');
                  }
               }

               if (userId) {
                  if (userState?.uid === userId) {
   
                     setUser(userState);
                     setUserValues(userState);// ! could introduce errors
                     setStatusMsgs(['click fields to edit ✏']); // TODO: abstract into own floating component
                     setCanEdit(true);
                  } else {
                     fetchUser(userId);
                  }
               } else { 
                  console.warn(`no userId`)
               }

            }
         }
      }, [userId, userState, navigate, location]
   );

   if (user && user !== 'not found') { // We have user!
      let focusEditUsername = () => {
         let input = usernameInput.current;
         if (input && canEdit) input.focus();
      }

      let focusEditBio = () => {
         let input = bioInput.current;
         if (input && canEdit) input.focus();
      }

      let setField = (value: string, field: 'username' | 'bio' | 'pic') => {
         switch (field) {
            case 'username':
               setUsername(value);
               break;
            case 'bio':
               setBio(value);
               break;
            case 'pic':
               setPic(value);
               break;
         }

         setEdited(true);
      }

      let validate = (): boolean => {
         let [ usernameValid, usernameMsgs ] = isUsernameValid(username);
         let [ bioValid, bioMsgs ] = isBioValid(bio);

         setStatusMsgs(new Array<string>(...usernameMsgs, ...bioMsgs));

         return (usernameValid && bioValid);
      }

      let update = async () => {
         setUpdating(true);
         if (user && user !== 'not found') {

            if (!validate()) {
               setStatusState('error');
               setUpdating(false);
               return;
            };

            let userRef = doc(fs, 'users', user.uid) as UserRef;

            await updateDoc<myUser>(userRef, {
               bio: bio,
               username: username,
               pic: 1
            });

         } else {
            console.error(`NO USER`)
         }

         setStatusState('success');
         setStatusMsgs(['Account updated succesfully'])
         setUpdating(false);
         setEdited(false);
      }

      let cancel = () => {
         if (user && user !== 'not found') {
            setUserValues(user);
            setStatusState('success');
            setStatusMsgs([]);
            setEdited(false);
         } else {
            console.error('something went wrong')
         }

      }

      return <form className="user-ctn" onSubmit={ e => { e.preventDefault() } }>
         <div className="user-header">
            {
               pic ? <img className="user-pic" src={pic} alt={'idk'} decoding="auto"/> : <div className="user-pic-loading"/>
            }
            <div className={`user-name-area group`} onClick={ () => { focusEditUsername() } }>
               <ContentEditable className={`user-name`} 
                  html={username} onChange={ e => setField(e.target.value, 'username') }
                  disabled={!canEdit} innerRef={ usernameInput } tagName="span"
                  />
               {
                  canEdit ? <AiFillEdit className={`user-name-edit-icon`}/> : <></>
               }
            </div>
         </div>
         <div className={`user-bio-area group`} onClick={ () => { focusEditBio() } }>
            <ContentEditable className={`user-bio`}
               onChange={ e => setField(e.target.value, 'bio')} tagName="span"
               html={ bio } disabled={!canEdit} innerRef={ bioInput }
               />
            {
               canEdit ? <AiFillEdit className={`bio-edit-icon`}/> : <></>
            }
         </div>
         <div className={`editing-status-area`}>
            {
               edited ? <>
                  <div className="status-btn save-btn" onClick={() => update()}>
                     save
                     {
                        updating ? 
                           <CgSpinner className={`loading-icon`}/> :
                           <BsCheck className={`status-icon`}/>
                     }
                  </div>
                  <div className="status-btn cancel-btn" onClick={() => cancel()}>
                     cancel
                     <MdOutlineCancel className={`status-icon cancel-icon`}/>
                  </div>
               </> : <></>
            }
            <div className="status-msgs">
               { statusMsgs.map( (v, i) => <div className={`status-msg
                  ${
                     statusState === 'error' ? 'text-error' : 
                        statusState === 'success' ? 'text-succ' : 'text-regular'
                  }
               `} key={i}>{v}</div> ) }
            </div>
         </div>
      </form>

   } else if (user === 'not found') { // TODO: create error page
      return <div className="mt-10 flex gap-4 items-center flex-col">
            <p className="text-3xl text-normal font-bold">
               no user found 
            </p>
         <div 
            className='bg-primary px-1 py-2 text-normal font-semibold text-lg rounded-md text-center flex place-items-center justify-center w-20 h-10'
            onClick={() => navigate('/feed')}
         >
            go back   
         </div>
      </div>
   } else { // Still fetching user (loading!)
      return <div className="user-ctn">
         <div className="user-header">
            <div className={`user-pic-loading`}/>
            <div className={`user-name user-name-loading`}/>
         </div>
         <div className={`user-bio`}>
            <div className={`user-bio-loading`}>
               <div className="bio-loading-text"/>
               <div className="bio-loading-text"/>
               <div className="bio-loading-text mb-4"/>
            </div>
         </div>
         <div className={`socials socials-loading`}/>
      </div>
   }
}

export default User;