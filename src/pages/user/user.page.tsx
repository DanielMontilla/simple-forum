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

interface UserPageProps {  }

const User: FC<UserPageProps> = () => {
   let { userId } = useParams();
   let userState = useContext(UserState);
   let navigate = useNavigate();
   let location = useLocation();

   let [ canEdit, setCanEdit ] = useState<boolean>(false);
   let [ edited, setEdited ] = useState<boolean>(false);
   let [ updating, setUpdating ] = useState<boolean>(false);
   let [ statusMsgs, setStatusMsgs ] = useState<string[]>(['click fields to edit ✏']);
   let [ statusState, setStatusState ] = useState<'error' | 'success' | 'hint'>('hint');
   let [ user, setUser ] = useState<myUser | null | 'not found'>(null);

   let usernameInput = useRef<HTMLInputElement>(null);
   let bioInput = useRef<HTMLSpanElement>(null);

   let [ username, setUsername ] = useState<string>('');
   let [ bio, setBio ] = useState<string>('');
   let [ pic, setPic ] = useState<Pic>(1);

   let setUserValues = (u: myUser) => {
      setUsername(u.username);
      setBio(u.bio || '');
      setPic(u.pic);
   }
   
   // FOR FETCHING DATA AND SETTING CORRECT PERMISSION STATES
   useEffect(
      () => {
         if (userState !== 'loading') { // When are done loading user data into userState
            if (location.pathname.endsWith('me')) {   // /me
               if (userState) { // Logged in
                  setUser(userState);
                  setUserValues(userState);   // ! could introduce errors
                  setCanEdit(true);
               } else if (userState === null) { // not Logged in
                  navigate(`/login`, { replace: true })
               }
            } else { // /uid
               let fetchUser = async (id: string) => {
                  let userRef = doc(fs, 'users', id) as UserRef;
                  let userDoc = await getDoc<myUser>(userRef);

                  console.log(userDoc.data())

                  if (userDoc.exists()) {
                     setUser(userDoc.data());
                     setUserValues(userDoc.data());
                     setCanEdit(false);
                  } else {
                     setUser('not found');
                  }
               }

               if (userId) {
                  if (userState?.uid === userId) { // Check whether userId path matches current user's uid
                     console.log(`is you! ${userState}`)
   
                     setUser(userState);
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
               // setPic(value);
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
               pic: pic
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
            <div className={`user-pic`}>

            </div>
            <div className={`user-name-area group`} onClick={ () => { focusEditUsername() } }>
               <input className={`user-name`} 
                  value={username} onChange={ e => setField(e.target.value, 'username') }
                  readOnly={!canEdit} type="text" ref={usernameInput}
                  />
               {
                  canEdit ? <AiFillEdit className={`user-name-edit-icon`}/> : <></>
               }
            </div>
         </div>
         <div className={`user-bio-area group`} onClick={ () => { focusEditBio() } }>
            <ContentEditable className={`user-bio`}
               onChange={ e => setField(e.target.value, 'bio')} tagName="span"
               html={ bio } disabled={!canEdit} innerRef={bioInput}
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
      return <> not found </>
   } else { // Still fetching user (loading!)
      return <div className="user-ctn">
         <div className="user-header">
            <div className={`user-pic user-pic-loading`}/>
            <div className={`user-name user-name-loading`}/>
         </div>
         <div className={`user-bio`}>
            <div className={`user-bio-loading`}>
               <div className="bio-loading-text"/>
               <div className="bio-loading-text"/>
               <div className="bio-loading-text"/>
            </div>
         </div>
         <div className={`socials socials-loading`}/>
      </div>
   }
}

export default User;