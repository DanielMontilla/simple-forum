import { dummyPost } from '../../util';
import './postcard.style.css'

interface PostCardProps { post?: PostData }

const PostCard: React.FC<PostCardProps> = ({post = dummyPost()}) => {

   return <div className="postcard">
      { post ? 'true' : 'false' }
   </div>
}

export default PostCard;