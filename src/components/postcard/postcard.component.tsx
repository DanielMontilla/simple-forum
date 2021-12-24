import { ImArrowUp } from 'react-icons/im';
import { FaCommentAlt } from 'react-icons/fa';
import { AiFillClockCircle } from 'react-icons/ai';

import './postcard.style.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Firebase stuff
import { getDoc } from 'firebase/firestore'

interface PostCardProps { postRef?: PostRef }

const PostCard: React.FC<PostCardProps> = ({ postRef }) => {
   let [ post, setPost ] = useState<PostData | undefined>(undefined);
   let [ author, setAuthor ] = useState<myUser | undefined>(undefined);

   useEffect(
      () => {
         let fetchPost = async () => {
            let postDoc = await getDoc<PostData>(postRef);
            let postData = postDoc.data();
      
            if (postData) {
               setPost(postData);
               let authorDoc = await getDoc<myUser>(postData.author);
               let authorData = authorDoc.data();
               if (authorData) setAuthor(authorData);
            };
         };
         if (postRef) fetchPost();
      }, [postRef]
   );

   if (post && author) {
      let { title, content, likes, dislikes, comments } = post;
      let age = '15h';

      return <div className="postcard">
         <div className="head">
            <div className="title"> 
               <Link to={`/post/${title}`} key={ title } >
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
               <div className="comment-count"> { comments.length } </div>
            </div>
            <div className="age">
               <AiFillClockCircle className="age-icon"/>
               <div className="age-count"> { age } </div>
            </div>
         </div>
      </div>
   } else {
      return <div className="postcard-load">

      </div>
   }

}

export default PostCard;