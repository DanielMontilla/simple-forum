import { dummyPost, randInt } from '../../util';
import { ImArrowUp } from 'react-icons/im';
import { FaCommentAlt } from 'react-icons/fa';
import { AiFillClockCircle } from 'react-icons/ai';

import './postcard.style.css';
import { Link } from 'react-router-dom';

interface PostCardProps { post?: PostData }

// TODO: create utility function to extract simplified age of post
let parseDate = (date: mDate) => '14h';

const PostCard: React.FC<PostCardProps> = ({post = dummyPost()}) => {
   let { title, content, publish_date, likeCount, dislikeCount, id } = post;
   let author = 'Daniel Montilla';
   let age = parseDate(publish_date);

   return <div className="postcard">
      <div className="title"> 
         <Link to={`/post/${id}`} key={id} >
            { title }
         </Link>
      </div>
      <div className="author"> { author } </div>
      <div className="cnt"> { content } </div>
      <div className="votes">
         <ImArrowUp className="vote-icon vote-up"/>
         <div className="vote-count"> { likeCount - dislikeCount } </div>
         <ImArrowUp className="vote-icon vote-down"/>
      </div>
      <div className="comments">
         <FaCommentAlt className="comment-icon"/>
         <div className="comment-count"> { randInt(0, 304) } </div>
      </div>
      <div className="age">
         <AiFillClockCircle className="age-icon"/>
         <div className="age-count"> { age } </div>
      </div>
   </div>
}

export default PostCard;