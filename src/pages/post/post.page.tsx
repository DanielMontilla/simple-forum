import { FC, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDoc } from "../../services/Firestore";
import { CommentData, Rating, myUser, PostData, Vote } from "../../types";
import { MdDateRange } from 'react-icons/md'
import { ImArrowUp } from 'react-icons/im';
import { fetchComments, rate, updateCount } from './post.util';

import './post.style.css'
import { fetchImgUrl } from "../../services/Storage";
import CommentCard from "../../components/commentcard/commentcard.component";
import { parseTimestamp } from "../../util";
import { CgSpinner } from "react-icons/cg";
import { UserState } from "../app";

interface PostProps { }

const Post: FC<PostProps> = () => {
   let { postId } = useParams<'postId'>();
   let [ post, setPost ] = useState<PostData | null | 'not found'>(null);
   let [ voteCount, setVoteCount ] = useState<number | '-'>('-');
   let [ author, setAuthor ] = useState<myUser | null | 'deleted'>(null);
   let [ authorPic, setAuthorPic ] = useState<string | null>(null);
   let [ comments, setComments ] = useState<CommentData[]>([]);
   let [ vote, setVote ] = useState<Rating | undefined>();
   let user = useContext(UserState);

   let nav = useNavigate();

   useEffect(
      () => {
         if (user !== 'loading' && user && postId) {
            
            let run = async (uid: string, postId: string) => {
               try {
                  let v = await fetchDoc<Vote>(`users/${uid}/votes`, postId);
                  setVote(v.rating)
               } catch (e) { // unvoted
                  setVote(undefined);
               }
            }

            run(user.uid, postId);
         }
      },
      [user, postId]
   );

   useEffect(
      () => {
         if (postId) {
            // Fetching post data
            fetchDoc<PostData>('posts', postId)
               .then(pData => { // post found!
                  setPost(pData);
                  setVoteCount(pData.voteCount);

                  // Fetching author data
                  fetchDoc<myUser>('users', pData.author)
                     .then(aData => { // author found!
                        setAuthor(aData)
                        fetchImgUrl(`pic_${aData.pic}.png`)
                           .then(iPath => setAuthorPic(iPath))
                     })
                     .catch(() => { // author not found :(
                        setAuthor('deleted')
                        fetchImgUrl(`pic_${0}.png`)
                           .then(iPath => setAuthorPic(iPath))
                     })
               })
               .catch(e => { // post not found
                  // TODO: add better error handeling
                  console.error(`Post could not be fetched.\n${e}`);
                  setPost('not found');
               })
         }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   );

   const  handleVote = async (rating: Rating) => {

      let count = 0;

      if (rating === 'liked' && vote === 'unvoted') count = 1;
      if (rating === 'liked' && vote === 'liked') count = -1;
      if (rating === 'liked' && vote === 'disliked') count = 2;
      if (rating === 'disliked' && vote === 'unvoted') count = -1;
      if (rating === 'disliked' && vote === 'disliked') count = 1;
      if (rating === 'disliked' && vote === 'liked') count = -2;
      setVoteCount(i => i as number + count);

      let uid: string | undefined = (user && user !== 'loading') ? user.uid : undefined;
      let pid: string = postId as string;
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

   if (post === 'not found') {
      // TODO: Add styles
      return <div>
         Post is either deleted or never existed :(
      </div>
   } else if (!post) { // Loading data
      return <CgSpinner className="animate-spin text-normal w-16 h-16 place-self-center"/>
   } else { // Loaded
      return <div className="post-cnt">
         <span className="post-title">
            { post.title }
         </span>
         <div className="post-sub-heading">
            <div className="post-author" onClick={ () => { if (author && author !== 'deleted') nav(`/user/${author.uid}`) } }>
               {
                  (author === 'deleted') ? author : 
                     (author) ? <>
                        {
                           authorPic ? <img className="author-pic" src={authorPic} alt={'idk'} decoding="auto"/> :
                                       <div className="author-pic-loading"/>
                        }
                        { author.username }
                        </> : '' // this case will never happen
               }
            </div>
            <div className="post-date">
               { parseTimestamp(post.publishDate) }
               <MdDateRange className="post-date-icon"/>
            </div>
         </div>
         <div className="post-body">
            { post.content }
         </div>
         <div className="flex justify-center">
            <div className="post-votes">
               <ImArrowUp 
                  onClick={ () => {handleVote('liked')}}
                  className={`post-vote-icon ${(vote === 'liked') ? 'text-primary' : ''}`} />
               <p className="w-20 text-center">{ voteCount }</p>
               <ImArrowUp 
                  onClick={ () => {handleVote('disliked')}}
                  className={`post-vote-icon transform rotate-180 ${(vote === 'disliked') ? 'text-primary' : ''}`}/>
            </div>
         </div>
         <div className="post-leave-comment">

         </div>
         <div className="post-comments">
               {
                  comments.map( (c, i) => <CommentCard data={ c } key={ i }/> )
               }
         </div>
      </div>
   }
}

export default Post;