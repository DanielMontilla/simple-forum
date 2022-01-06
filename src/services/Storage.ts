import { getDownloadURL , ref } from "firebase/storage";
import { Storage } from "../firebase.config";

export const fetchImgUrl = async (path: string) => {
   return await getDownloadURL(ref(Storage, path));
}