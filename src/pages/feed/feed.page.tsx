import PostCard from "../../components/postcard/postcard.component";
import './feed.style.css'

// Firebase stuff
import { collection, orderBy, query, getDocs, limit } from "firebase/firestore";
import { Firestore as fs } from "../../firebase.config";
import { useEffect, useState } from "react";
import { randID } from "../../util";

const Feed: React.FC = () => {
   let [ posts, setPosts ] = useState<Array<PostRef | undefined>>(new Array(30).fill(undefined));
   
   useEffect(
      () => {
         let fetchMore = () => {
            // fetching next batch of posts
         };
         let fetchInit = async () => {
            // Fetching newest posts
            let ref = collection(fs, 'posts') as PostColRef;
            let q = query<PostData>(ref, orderBy('publishDate', 'desc'), limit(5));
            let postsData = await getDocs(q);
            let arr: PostRef[] = [];
            
            postsData.forEach(
               post => arr.push(post.ref)
            );

            setPosts(arr);
         };
            
         fetchInit();
      }, []
   );

   return <main>
      {
         posts.map( post => <PostCard postRef={ post } key={ randID(5) }/>)
      }
   </main>

}

export default Feed;