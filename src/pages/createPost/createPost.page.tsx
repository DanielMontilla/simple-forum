import { FC, useContext, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import { MdPostAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/notification/notification.component";
import SubmitButton from "../../components/submitButton/submitButton.component";
import { getRef } from "../../services/Firestore";
import { myUser, NotificationConfig } from "../../types";
import { UserState } from "../app";
import './createPost.style.css'
import { validateTitle, generateRandomPost, validateContent, publishPost } from "./createPost.util";


interface CreatePostProps {};

let titlePlaceHolder = 'Edit title ✏';
let contentPlaceHolder = 'Edit Content';

const CreatePost: FC<CreatePostProps> = () => {
   let user = useContext(UserState);
   let [ title, setTitle ] = useState<string>('');
   let [ content, setContent ] = useState<string>('');
   let [ loading, setLoading ] = useState<boolean>(false);
   let [ notifs, setNotifs ] = useState<NotificationConfig[]>([]);

   let nav = useNavigate();

   const sumbit = async (u: myUser) => {
      // Validating stuff :)
      setLoading(true);

      let titleErrors = validateTitle(title);
      let contentErrors = validateContent(content);

      if (titleErrors.length || contentErrors.length) {
         setNotifs([...titleErrors, ...contentErrors].map<NotificationConfig>(m => {return {msg: m, status: 'error'}}));
      } else {
         console.log('b')
         try {
            let ref = await publishPost(u.uid, title, content);
            setNotifs([{msg: 'Post successfully published! Redirecting...', status:'succesful'}])
            await new Promise(() => setTimeout(() => nav(`/post/${ref.id}`), 2000))
         } catch {
            // TODO: error checking
         }
      }

      setLoading(false);
   }

   if (user === 'loading') {
      // If user state is loading
      // TODO: finish
      return <p className={'text-normal text-xl font-bold'}>LOADING</p>
   } else if (user) {
      // If user is loaded
      
      return <form className="cpost-ctn" onSubmit={ e => { e.preventDefault(); } }>
         <ContentEditable className={`cpost-title`} tagName="span" html={ title } 
            placeholder={titlePlaceHolder}
            onChange={ e => setTitle(e.target.value)}
            disabled={loading}
         />

         <ContentEditable className={`cpost-content`} tagName="span" html={ content }
            placeholder={contentPlaceHolder}
            onChange={ e => setContent(e.target.value) }
            disabled={loading}
         />
         <SubmitButton label="Post" callback={ () => sumbit(user as myUser) } load={loading} Icon={MdPostAdd} extra={'mt-1'}/>
         {
            notifs.length ? <Notification msgs={ notifs }/> : <></>
         }
      </form>
   } else {
      // if user not logged in
      return <></>
   }
}

export default CreatePost;