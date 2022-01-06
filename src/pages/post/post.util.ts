import { Firestore as fs } from "../../firebase.config";
import { collection, CollectionReference, query, orderBy, limit, getDocs } from "firebase/firestore";
import { CommentData } from "../../types";

export const fetchComments = async (postId: string) => {
   let colRef = collection(fs, 'posts', postId, 'comments') as CollectionReference<CommentData>;
   let q = query<CommentData>(colRef, orderBy('date', 'desc'), limit(10));
   let comments = await getDocs(q);

   return comments;
}