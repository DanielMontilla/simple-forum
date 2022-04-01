import { addDoc, collection, CollectionReference, doc, DocumentReference, getDoc, getDocs, limit, orderBy, query, setDoc, startAt } from "firebase/firestore";
import { Firestore as fs } from "../firebase.config";

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

export const createDoc = async<T>(root: string, data: T, id: string) => {
   let col_ = collection(fs, root) as CollectionReference<T>;
   
   let ref_: DocumentReference<T>;
   if (id) {
      ref_ = doc<T>(col_, id);
      await setDoc<T>(ref_, data);
   } else {
      ref_ = await addDoc<T>(col_, data);
   }

   return ref_;
}

export const docExists = async(root: string, id?: string): Promise<boolean> => {
   let col_ = collection(fs, root);
   let ref_ = doc(col_, id);
   let doc_ = await getDoc(ref_);

   return doc_.exists()
}

export const getRef = <T>(root: string, id: string) => {
   return doc(fs, root, id) as DocumentReference<T>;
}