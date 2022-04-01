import { ImArrowUp } from 'react-icons/im';
import { FaCommentAlt } from 'react-icons/fa';
import { AiFillClockCircle } from 'react-icons/ai';

import './postcard.style.css';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

// Firebase stuff
import { PostRef, PostData, myUser, Rating, Vote } from '../../types';
import { fetchDoc } from '../../services/Firestore';
import { UserState } from '../../pages/app';
import { rate, updateCount } from '../../pages/post/post.util';

interface PostCardProps { postRef?: PostRef }

const PostCard: React.FC<PostCardProps> = ({ postRef }) => {
   let [ post, setPost ] = useState<PostData | undefined>(undefined);
   let [ voteCount, setVoteCount ] = useState<number>(0);
   let [ author, setAuthor ] = useState<myUser | undefined | 'deleted'>(undefined);
   let [ vote, setVote ] = useState<Rating>('unvoted');
   let user = useContext(UserState);

   useEffect(
      () => {

         let fetch = async (ref: PostRef, uid: string) => {
            try {
               let postData = await fetchDoc<PostData>('posts', ref);
               let authorData: myUser | 'deleted';

               try {
                  authorData = await fetchDoc<myUser>('users', postData.author);
               } catch {
                  authorData = 'deleted';
               }

               try {
                  let v = await fetchDoc<Vote>(`users/${uid}/votes`, ref.id);
                  setVote(v.rating)
               } catch (e) { // unvoted
                  setVote('unvoted');
               }
               
               setAuthor(authorData);
               setPost(postData);
               setVoteCount(postData.voteCount);
            } catch (e) { console.error(e) } // TODO: better error handeling
         }

         if (user && user !== 'loading' && postRef) fetch(postRef, user.uid);
      }, [postRef, user]
   );

   const handleVote = async (rating: Rating) => {

      let count = 0;

      if (rating === 'liked' && vote === 'unvoted') count = 1;
      if (rating === 'liked' && vote === 'liked') count = -1;
      if (rating === 'liked' && vote === 'disliked') count = 2;
      if (rating === 'disliked' && vote === 'unvoted') count = -1;
      if (rating === 'disliked' && vote === 'disliked') count = 1;
      if (rating === 'disliked' && vote === 'liked') count = -2;
      setVoteCount(i => i as number + count);

      let uid: string | undefined = (user && user !== 'loading') ? user.uid : undefined;
      let pid: string = (postRef as PostRef).id;
      let p: PostData = post as PostData;

      try {
         if (uid) {

            if (rating === vote) rating = 'unvoted';

            setVote(rating)
            await rate(uid, pid, rating)
            updateCount(pid, p, count)
         } else {
            // TODO: add notification to sign up
         }
      } catch (e) {
         console.log(e)
      }
   }

   if (post && author && postRef) {
      let { title, content, commentCount } = post;
      let path = postRef.id;
      let age = '15h';

      return <div className="postcard">
         <div className="head">
            <div className="title"> 
               <Link to={`/post/${path}`} key={ title } >
                  { title }
               </Link>
            </div>
            <div className="author"> { author === 'deleted' ? author : author ? author.username : '' } </div>
         </div>
         <div className="post-preview-context"> { content } </div>
         <div className="actions">
            <div className="votes">
               <ImArrowUp 
                  onClick={ () => handleVote('liked') }
                  className={`${vote === 'liked' ? 'text-primary' : 'text-normal'} vote-icon vote-up`}/>
               <div className="vote-count"> { voteCount } </div>
               <ImArrowUp 
               onClick={ () => handleVote('disliked') }
                  className={`${vote === 'disliked' ? 'text-primary' : 'text-normal'} vote-icon vote-down`}/>
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
