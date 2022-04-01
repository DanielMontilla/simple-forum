import PostCard from "../../components/postcard/postcard.component";
import './feed.style.css'

import { useEffect, useState } from "react";
import { PostRef, PostSnap } from "../../types";
import { fetchPostRefs } from "./feed.util";

const batchSize = 10;

const Feed: React.FC = () => {
   let [ posts, setPosts ] = useState<Array<PostRef | undefined>>([]);
   let [ lastPost, setLastPost ] = useState<PostSnap>();

   const loadPosts = async (first?: boolean) => {
      setPosts(p => [...p, ...new Array(batchSize).fill(undefined)]); // Fill with unloaded posts
      let [refs, last] = await fetchPostRefs(batchSize, lastPost); // fetch post references

      if (first) {
         setPosts(refs)
      } else {
         setPosts(p => [...p.slice(0, -batchSize), ...refs]); // set new posts
      }
      setLastPost(last); // paginate result
   }
      
   // useEffect(
   //    () => {
   //    loadPosts(true)
   //    // TODO: add clean up
   //    return () => {}
   //    }, []
   // );

   return <main>
      {
         posts.map( (post, i) => <PostCard postRef={ post } key={ i }/>)
      }
      <button onClick={() => loadPosts()}>
         loadmore
      </button>
   </main>

}

export default Feed;