import { Timestamp } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDoc } from "../../services/Firestore";
import { fetchImgUrl } from "../../services/Storage";
import { CommentData, CommentRef, myUser } from "../../types";
import { parseTimestamp } from "../../util";
import './commentcard.style.css';

interface CommentCardProps { data?: CommentRef };

const CommentCard: FC<CommentCardProps> = ({ data }) => {
   // undefined === loading...
   let [ comment, setComment ] = useState<CommentData | undefined>(undefined);
   let [ author, setAuthor ] = useState<myUser | null | 'deleted'>(null);
   let [ authorPic, setAuthorPic ] = useState<string | null>(null);

   let nav = useNavigate();

   useEffect(
      () => {
         let load = async (ref: CommentRef) => {
            let commentData = await fetchDoc<CommentData>(ref.parent.path, ref);
            setComment(commentData);
            let authorData: myUser | 'deleted';
            let pic: string = '0';
            try {
               authorData = await fetchDoc<myUser>('users', commentData.author);
               pic = `${authorData.pic}`;
            } catch {
               authorData = 'deleted';
            }
            setAuthor(authorData);
            pic = await fetchImgUrl(`pic_${pic}.png`);
            setAuthorPic(pic);
         }
         if (data) load(data);
      }, [data]
   );

   if (comment) {
   return <div className="commentcard-ctn">
      <div className="commentcard-data">
         {
            authorPic ? <img src={authorPic} alt={'idk'} decoding="auto"
               className="commentcard-author-pic"
            /> : <div className="commentcard-author-pic-loading"/>
         }
         <div className="commentcard-author-name" onClick={ () => { if (author && author !== 'deleted') nav(`/user/${author.uid}`) } }>
            {
               author === null ? <div className="commentcard-autho-name-loading"/> :
               author !== 'deleted' ? author.username : ''
            }
         </div>
         {` • `}
         <div className="commentcard-publish-date">
            { parseTimestamp(comment.publishDate) }
         </div>
      </div>
      <div className="commentcard-content">
            {comment.content}
      </div>
   </div>
   } else {
      return <div className="commentcard-ctn-loading"/>
   }
}

export default CommentCard;