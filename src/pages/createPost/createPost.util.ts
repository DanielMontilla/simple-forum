import { DocumentReference, Timestamp, addDoc, collection } from "firebase/firestore";
import { Firestore as fs } from "../../firebase.config";
import { myUser, PostColRef, PostData } from "../../types";

const validatePost = (data: PostData) => {

}

export const createPost = async (
   author: DocumentReference<myUser>,
   title: string,
   content: string,
   date?: Date
) => {
   let _col = collection(fs, 'posts') as PostColRef;

   let data: PostData = {
      author: author,
      publishDate: Timestamp.fromDate(date || new Date()),
      editDate: Timestamp.fromDate(date || new Date()),
      title: title,
      content: content,
      likes: 0, dislikes: 0, commentCount: 0
   }

   await addDoc(_col, data);
};