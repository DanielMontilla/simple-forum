import { CollectionReference, DocumentReference, Timestamp } from "firebase/firestore";

export interface PostData {
   author: DocumentReference<myUser>
   publishDate: Timestamp
   editDate: Timestamp

   title: string
   content: string
   media?: string

   likes: number
   dislikes: number
   commentCount: number
}

export interface CommentData {
   author: UserRef,
   content: string,
   date: Timestamp
}

export type Pic = 0 | 1 | 2 | 3 | 4 | 5

export interface myUser {
   uid: string
   username: string
   verified: boolean
   pic: Pic
   bio?: string
}

export type PostRef = DocumentReference<PostData>;
export type PostColRef = CollectionReference<PostData>;

export type UserRef = DocumentReference<myUser>;
export type UserColRef = CollectionReference<myUser>;

export type CommentRef = DocumentReference<CommentData>;
export type CommentColRef = CollectionReference<CommentData>;