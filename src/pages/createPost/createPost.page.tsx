import { FC, useContext, useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import { CgSpinner } from "react-icons/cg";
import { MdPostAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/notification/notification.component";
import SubmitButton from "../../components/submitButton/submitButton.component";
import { getRef } from "../../services/Firestore";
import { CommentData, myUser, NotificationConfig } from "../../types";
import { parseTimestamp, rand } from "../../util";
import { UserState } from "../app";
import { publishComment } from "../post/post.util";
import './createPost.style.css'
import { validateTitle, generateRandomPost, validateContent, publishPost, publishCustomPost, generateRandomComment } from "./createPost.util";


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

   const submit = async (u: myUser) => {
      // Validating stuff :)
      setLoading(true);
      setNotifs([]);

      setTimeout(async () => { // Artificially added delay to simulate change and void react component optimizations
         let titleErrors = validateTitle(title);
         let contentErrors = validateContent(content);
   
         if (titleErrors.length || contentErrors.length) {
            setNotifs([...titleErrors, ...contentErrors].map<NotificationConfig>(m => {return {msg: m, status: 'error'}}));
         } else {
            try {
               let ref = await publishPost(u.uid, title, content);
               setNotifs([{msg: 'Post successfully published! Redirecting...', status:'succesful'}])
               await new Promise(() => setTimeout(() => nav(`/post/${ref.id}`), 2000))
            } catch {
               // TODO: error checking
            }
         }

         setLoading(false);
      }, 100)

   }

   // let temp = async (amount: number) => {
   //    setLoading(true);

   //    for (let i = 0; i < amount; i++) {
   //       let post = generateRandomPost();
   //      let ref = await publishCustomPost(post);
   //      for (let j = 0; j < rand(0, 60); j++) {
   //         let comment = generateRandomComment(post.publishDate);
   //         await publishComment(ref.id, comment.author.id, comment.content, comment.publishDate)
   //      }
   //    }

   //    setLoading(false);
   // }

   if (user === 'loading') {
      return <div className="flex w-full h-screen justify-center items-center">
         <CgSpinner className='text-normal font-bold fill-current animate-spin h-24 w-24'/>
      </div>
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
         <SubmitButton label="Post" callback={ () => submit(user as myUser) } load={loading} Icon={MdPostAdd} extra={'mt-1'}/>
         {/* <SubmitButton label="Mass" callback={ () => temp(50) } load={loading} Icon={MdPostAdd} extra={'mt-1'}/> */}
         {
            notifs.length ? <Notification msgs={ notifs } delay={3000}/> : <></>
         }
      </form>
   } else {
      // TODO: if user not logged in
      return <></>
   }
}

export default CreatePost;