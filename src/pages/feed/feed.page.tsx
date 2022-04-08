import PostCard from "../../components/postcard/postcard.component";
import './feed.style.css'

import { useEffect, useState } from "react";
import { PostRef, PostSnap } from "../../types";
import { fetchPostRefs } from "./feed.util";

const batchSize = 20;

const Feed: React.FC = () => {
   let [ posts, setPosts ] = useState<Array<PostRef | undefined>>([]);
   let [ lastPost, setLastPost ] = useState<PostSnap>();
   let [ morePosts, setMorePosts ] = useState<Boolean>(true);

   const loadPosts = async (first?: boolean) => {
      setPosts(p => [...p, ...new Array(batchSize).fill(undefined)]); // Fill with unloaded posts
      let [refs, last] = await fetchPostRefs(batchSize, lastPost); // fetch post references

      if (first) {
         setPosts(refs)
      } else {
         setPosts(p => [...p.slice(0, -batchSize), ...refs]); // set new posts
      }

      if (last) {
         setLastPost(last); // paginate result
      } else {
         setMorePosts(false);
      }
   }
      
   useEffect(
      () => {
      let p = loadPosts(true);
      return () => {}
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []
   );

   return <main>
      <div className="feed">
         {
            posts.map( (post, i) => <PostCard postRef={ post } key={ i }/>)
         }
      </div>
      {
         !posts.length ? <></> :
         morePosts ? <div 
            className='
               h-9 w-36 px-2 pb-1 bg-primary font-semibold text-center leading-none align-middle
               flex justify-center items-center rounded-md self-center place-self-center
            '
            onClick={ () => loadPosts() }
         >
            more posts
         </div> : <div className='
            text-normal font-semibold place-items-center text-center
         '>
            no more posts :(
         </div>
      }
   </main>

}

export default Feed;