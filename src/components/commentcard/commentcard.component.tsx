import { Timestamp } from "firebase/firestore";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDoc } from "../../services/Firestore";
import { fetchImgUrl } from "../../services/Storage";
import { CommentData, myUser } from "../../types";
import './commentcard.style.css';

interface CommentCardProps { data: CommentData };

const CommentCard: FC<CommentCardProps> = ({ data }) => {
   // null === loading...
   let [ author, setAuthor ] = useState<myUser | null | 'deleted'>(null);
   let [ authorPic, setAuthorPic ] = useState<string | null>(null);

   let nav = useNavigate();

   useEffect(
      () => {
         let fetch = async () => {
            try {
               let guy = await fetchDoc<myUser>('users', data.author);
               setAuthor(guy);
               let pic = await fetchImgUrl(`pic_${guy.pic}.png`);
               setAuthorPic(pic);
            } catch {
               setAuthor('deleted');
               setAuthorPic(await fetchImgUrl(`pic_${0}.png`));
            }
         };

         let date = data.date.toDate();

         fetch();
      }, [data]
   );

   return <div className="comment-cnt">
      <div className="comment-author-header">
         <div className="comment-author-info">
            {
               authorPic ? 
                  <img className="comment-author-pic" src={ authorPic } alt={'idk'}/> :
                  <div className="comment-author-pic-loading"/>
            }
            <div className="comment-author-name">
               {
                  author && author !== 'deleted' ? 
                     <p onClick={ () => { nav(`/user/${(author as myUser).uid}`) }}>{author.username}</p> :
                     !author ? 
                        <div className="comment-author-name-loading"/> :
                        author
               }
            </div>
         </div>
         <div className="comment-date">

         </div>
      </div>
      <div className="comment-content">
         { data.content }
      </div>
   </div>
}

export default CommentCard;