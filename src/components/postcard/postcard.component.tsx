import { ImArrowUp } from 'react-icons/im';
import { FaCommentAlt } from 'react-icons/fa';
import { AiFillClockCircle } from 'react-icons/ai';

import './postcard.style.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Firebase stuff
import { PostRef, PostData, myUser } from '../../types';
import { fetchDoc } from '../../services/Firestore';

interface PostCardProps { postRef?: PostRef }

const PostCard: React.FC<PostCardProps> = ({ postRef }) => {
   let [ post, setPost ] = useState<PostData | undefined>(undefined);
   let [ author, setAuthor ] = useState<myUser | undefined>(undefined);

   useEffect(
      () => {

         let fetch = async (ref: PostRef) => {
            try {
               let postData = await fetchDoc<PostData>('posts', ref);
               let authorData = await fetchDoc<myUser>('users', postData.author);
               setPost(postData);
               setAuthor(authorData);
            } catch (e) { console.error(e) } // TODO: better error handeling
         }
         if (postRef) fetch(postRef);
      }, [postRef]
   );

   if (post && author && postRef) {
      let { title, content, likes, dislikes, commentCount } = post;
      let path = postRef.id;
      let age = '15h';

      return <div className="postcard">
         <div className="head">
            <div className="title"> 
               <Link to={`/post/${path}`} key={ title } >
                  { title }
               </Link>
            </div>
            <div className="author"> { author.username } </div>
         </div>
         <div className="cnt"> { content } </div>
         <div className="actions">
            <div className="votes">
               <ImArrowUp className="vote-icon vote-up"/>
               <div className="vote-count"> { likes - dislikes } </div>
               <ImArrowUp className="vote-icon vote-down"/>
            </div>
            <div className="comments">
               <FaCommentAlt className="comment-icon"/>
               <div className="comment-count"> { commentCount } </div>
            </div>
            <div className="age">
               <AiFillClockCircle className="age-icon"/>
               <div className="age-count"> { age } </div>
            </div>
         </div>
      </div>
   } else {
      return <div className="postcard-load"/>
   }

}

export default PostCard;