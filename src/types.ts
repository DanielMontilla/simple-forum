import { CollectionReference, DocumentReference, QueryDocumentSnapshot, Timestamp } from "firebase/firestore";

export type NotificationConfig = { msg: string, status?: 'normal' | 'error' | 'succesful'}

export interface PostData {
   author: DocumentReference<myUser>
   publishDate: Timestamp
   editDate: Timestamp

   title: string
   content: string
   media?: string

   voteCount: number
   commentCount: number
}

export interface CommentData {
   author: UserRef,
   content: string,
   publishDate: Timestamp
}

export type Pic = 0 | 1 | 2 | 3 | 4 | 5

export interface myUser {
   uid: string
   username: string
   verified: boolean
   pic: Pic
   bio: string
}

export type Rating = 'liked' | 'disliked' | 'unvoted';

export interface Vote {
   rating: Rating;
}

export type PostRef = DocumentReference<PostData>;
export type PostColRef = CollectionReference<PostData>;

export type UserRef = DocumentReference<myUser>;
export type UserColRef = CollectionReference<myUser>;

export type CommentRef = DocumentReference<CommentData>;
export type CommentColRef = CollectionReference<CommentData>;

export type PostSnap = QueryDocumentSnapshot<PostData>;
export type CommentSnap = QueryDocumentSnapshot<CommentData>;