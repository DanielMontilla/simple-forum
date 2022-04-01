import { collection, query, orderBy, limit, startAt, getDocs, startAfter } from "firebase/firestore";
import { PostRef, PostColRef, PostData, PostSnap } from "../../types";
import { Firestore as fs } from "../../firebase.config";

export const fetchPostRefs = async (amount: number, startDoc?: PostSnap): Promise<[PostRef[], PostSnap]> => {
   let col_ = collection(fs, 'posts') as PostColRef;
   let constrains = [orderBy('publishDate', 'desc'), limit(amount)]
   if (startDoc) constrains.push(startAfter(startDoc));
   let query_ = query<PostData>(col_, ...constrains);
   let docs_ = await getDocs(query_);

   let refs: PostRef[] = [];
   let last = docs_.docs[docs_.docs.length-1];

   docs_.forEach(post => refs.push(post.ref));

   return [refs, last];
}