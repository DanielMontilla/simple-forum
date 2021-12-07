import { useParams } from "react-router-dom";

const Post: React.FC = () => {
   let { postId } = useParams() as { postId: string };

   return <h1>
      { postId }
   </h1>
}

export default Post;