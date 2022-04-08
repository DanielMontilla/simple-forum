import { FC, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDoc } from "../../services/Firestore";
import { CommentData, Rating, myUser, PostData, Vote, CommentRef, CommentSnap, NotificationConfig } from "../../types";
import { MdDateRange, MdPostAdd } from 'react-icons/md'
import { ImArrowUp } from 'react-icons/im';
import { fetchCommentRefs, fetchComments, publishComment, rate, updateCommentCount, updateVoteCount, validateComment } from './post.util';

import './post.style.css'
import { fetchImgUrl } from "../../services/Storage";
import CommentCard from "../../components/commentcard/commentcard.component";
import { parseTimestamp } from "../../util";
import { CgSpinner } from "react-icons/cg";
import { UserState } from "../app";
import ContentEditable from "react-contenteditable";
import SubmitButton from "../../components/submitButton/submitButton.component";
import Notification from "../../components/notification/notification.component";
import { AiOutlineReload } from "react-icons/ai";

interface PostProps { }

const batchSize = 10;
const commentPlaceholder = 'leave a comment 📃';

const Post: FC<PostProps> = () => {
   let { postId } = useParams<'postId'>();
   let [ post, setPost ] = useState<PostData | null | 'not found'>(null);
   let [ voteCount, setVoteCount ] = useState<number | '-'>('-');
   let [ author, setAuthor ] = useState<myUser | null | 'deleted'>(null);
   let [ authorPic, setAuthorPic ] = useState<string | null>(null);
   let [ comments, setComments ] = useState<Array<CommentRef | undefined>>([]);
   let [ lastComment, setLastComment ] = useState<CommentSnap>();
   let [ vote, setVote ] = useState<Rating>('unvoted');
   let [ comment, setComment ] = useState<string>('');
   let [ publishingComment, setPublishingComment ] = useState<boolean>(false);
   let [ notifs, setNotifs ] = useState<NotificationConfig[]>([]);
   let [ moreComments, setMoreComments ] = useState<boolean>(true);
   let user = useContext(UserState);
   let nav = useNavigate();

   const loadComments = async (first?: boolean) => {
      setComments(c => [...c, ...new Array(batchSize).fill(undefined)]); // Fill with unloaded comments NOTE: not needed :/
      let [refs, last] = await fetchCommentRefs(postId as string, batchSize, lastComment); // fetch comment references

      if (first) {
         setComments(refs);
      } else {
         setComments(c => [...c.slice(0, -batchSize), ...refs]); // set new comments
      }

      if (last) {
         setLastComment(last); // paginate result=
      } else {
         setMoreComments(false);
      }
   }

   const submitComment = async () => {
      setPublishingComment(true);
      setNotifs([]);

      setTimeout(async () => { // react is doing some insance optimization thats not letting my notification components refresh. added artificial delay
         if (user === null) {
            setNotifs([{msg: `please log in to comment`, status: 'error'}]);
            setComment('');
            setPublishingComment(false);
            return;
         }
         
         if (user === 'loading') {
            setNotifs([{msg: `can't validate user. Try again in a few secods`, status: 'error'}]);
            setComment('');
            setPublishingComment(false);
            return;
         }
   
         let errors = validateComment(comment);
   
         if (errors.length) {
            setNotifs(errors.map<NotificationConfig>(m => {return {msg: m, status: 'error'}}));
         } else {
            try {
               let ref = await publishComment(postId as string, user.uid, comment);
               setComment('');
               setNotifs([{msg: 'comments published!', status: 'succesful'}]);
               setComments(c => [ref, ...c]);
            } catch {
               // TODO: error checking
            }
         }

         setPublishingComment(false);
      }, 100)
   }

   useEffect(
      () => {
         if (user !== 'loading' && user && postId) {
            
            let run = async (uid: string, postId: string) => {
               try {
                  let v = await fetchDoc<Vote>(`users/${uid}/votes`, postId);
                  setVote(v.rating)
               } catch (e) { }
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
            
            loadComments();
         }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
   );

   const  handleVote = async (rating: Rating) => {

      // console.log(`Rating is: ${rating}`)
      // console.log(`Current Vote is: ${vote}`)

      let count = 0;

      if (rating === 'liked' && vote === 'unvoted') count = 1;
      if (rating === 'liked' && vote === 'liked') count = -1;
      if (rating === 'liked' && vote === 'disliked') count = 2;
      if (rating === 'disliked' && vote === 'unvoted') count = -1;
      if (rating === 'disliked' && vote === 'disliked') count = 1;
      if (rating === 'disliked' && vote === 'liked') count = -2;

      let uid: string | undefined = (user && user !== 'loading') ? user.uid : undefined;
      let pid: string = postId as string;
      let p: PostData = post as PostData;

      try {
         if (uid) {

            if (rating === vote) rating = 'unvoted';

            setVote(rating)
            await rate(uid, pid, rating)
            setVoteCount(i => i as number + count);
            updateVoteCount(pid, p, count)
         } else {
            setNotifs([]);
            setTimeout(() => setNotifs([{msg: 'signin to vote', status: 'error'}]), 100)
         }
      } catch (e) {
         console.log(e)
      }
   }
   if (post === 'not found') {
      // TODO: Add styles
      return <div className="flex flex-col gap-4 justify-center items-center place-content-center select-none">
         <div className="text-4xl font-bold p-7 text-regular text-center">
            Post is either deleted or never existed :(
         </div>
         <div className="text-xl text-center bg-primary text-normal rounded-sm w-auto font-medium leading-none p-2" 
            onClick={() => nav('/feed') }>
            take me back
         </div>
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
         <ContentEditable
            className={`post-submit-comment`} html={comment} placeholder={commentPlaceholder}
            onChange={ e => setComment(e.target.value) }
         />
         <SubmitButton label="submit" callback={ () => submitComment() } load={publishingComment} Icon={MdPostAdd} extra={'post-submit-comment-btn'}/>
         {
            notifs.length ? <Notification msgs={ notifs } delay={3000}/> : <></>
         }
         <div className="post-comments">
               {
                  comments.map( (c, i) => <CommentCard data={ c } key={ i }/> )
               }
         </div>
         {
            !comments.length ? <div className='
            text-normal font-semibold place-items-center text-center
            '>
               no comments yet :(
            </div> :
            moreComments ? <div 
               className='
                  h-9 w-36 px-2 pb-1 bg-primary font-semibold text-center leading-none align-middle
                  flex justify-center items-center rounded-md self-center place-self-center mt-1
               '
               onClick={ () => loadComments() }
               >
               more comments
            </div> : <div className='
               text-normal font-semibold place-items-center text-center
            '>
               no more comments :(
            </div>
         }
      </div>
   }
}

export default Post;