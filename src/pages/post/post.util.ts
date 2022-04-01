import { Firestore as fs } from "../../firebase.config";
import { collection, CollectionReference, query, orderBy, limit, getDocs } from "firebase/firestore";
import { CommentData, PostData, Rating, Vote } from "../../types";
import { createDoc, docExists, fetchDoc } from "../../services/Firestore";

export const fetchComments = async (postId: string) => {
   let colRef = collection(fs, 'posts', postId, 'comments') as CollectionReference<CommentData>;
   let q = query<CommentData>(colRef, orderBy('date', 'desc'), limit(10));
   let comments = await getDocs(q);

   return comments;
}

export const rate = async (uid: string, pid: string, rating: Rating) => {
   await createDoc<Vote>(`users/${uid}/votes`, { rating: rating }, pid);
}

export const updateCount = async (pid: string, post: PostData, count: number) => {
   post.voteCount += count;

   await createDoc<PostData>('posts', post, pid);
}