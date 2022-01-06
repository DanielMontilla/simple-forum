import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchDoc } from "../../services/Firestore";
import { CommentData, CommentRef, myUser, PostData } from "../../types";
import { MdDateRange } from 'react-icons/md'
import { ImArrowUp } from 'react-icons/im';
import { fetchComments } from './post.util'

import './post.style.css'
import { fetchImgUrl } from "../../services/Storage";
import CommentCard from "../../components/commentcard/commentcard.component";
import { parseTimestamp } from "../../util";

interface PostProps { }

const Post: FC<PostProps> = () => {
   let { postId } = useParams<'postId'>();
   let [ post, setPost ] = useState<PostData | null | 'not found'>(null);
   let [ author, setAuthor ] = useState<myUser | null | 'deleted'>(null);
   let [ authorPic, setAuthorPic ] = useState<string | null>(null);
   let [ comments, setComments ] = useState<CommentData[]>([]);

   let nav = useNavigate();

   useEffect(
      () => {
         let fetchPost = async (id: string) => {
            try {
               let postData = await fetchDoc<PostData>('posts', id);
               setPost(postData);

               try {
                  let authorData = await fetchDoc<myUser>('users', postData.author);
                  
                  setAuthor(authorData);
                  setAuthorPic(await fetchImgUrl(`pic_${authorData.pic}.png`));
               } catch {
                  setAuthor('deleted');
                  setAuthorPic(await fetchImgUrl(`pic_${0}.png`));
               }

            } catch { setPost('not found') }
         }

         let fetchLatestComments = async (id: string) => {
            let commentSnaps = await fetchComments(id);
            let comments: CommentData[] = [];
            commentSnaps.forEach(c => comments.push(c.data()));
            setComments(comments)
         }

         if (postId) { fetchPost(postId); fetchLatestComments(postId) };
      }, [ postId ]
   );


   if (post === 'not found') {
      // TODO: this
      return <> not found </>
   } else if (!post) { // Loading data
      return <> loading </>
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
               <ImArrowUp className="post-vote-icon"/>
               <p className="w-20 text-center">{ post.likes - post.dislikes }</p>
               <ImArrowUp className="post-vote-icon transform rotate-180"/>
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