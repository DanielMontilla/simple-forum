import { collection, CollectionReference, doc, DocumentReference, getDoc, getDocs, limit, orderBy, query } from "firebase/firestore";
import { Firestore as fs } from "../firebase.config";
import { CommentColRef } from "../types";

/**
 * @template T type of data
 * @param root path segement leading to document. Basically the collection path
 * @param id document ID or document reference
 * @returns document data
 */
export const fetchDoc = async <T>(root: string, id: string | DocumentReference<T>) => {
   let col_ = collection(fs, root) as CollectionReference<T>; 
   let ref_ = (typeof id === 'string') ? doc<T>(col_, id) : id;
   let doc_ = await getDoc<T>(ref_);

   if (!doc_.exists()) throw Error(`Document does't exist`);
   return doc_.data() as T;
}