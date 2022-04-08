import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, deleteUser, signOut } from "firebase/auth";
import { Auth } from "../firebase.config";
import { myUser, Pic } from "../types";
import { isBioValid, isUsernameValid, randInt, randPick } from "../util";
import { createDoc } from "./Firestore";

export const createUser = async (
   email: string, 
   password: string, 
   name: string, 
   bio?: string, 
   pic?: Pic
): Promise<[ user: myUser | null, msgs: string[] ]> => {

   let [uValid, uMsgs] = isUsernameValid(name);
   let [bValid, bMsgs] = isBioValid(name);

   let isValid = uValid && bValid;
   let msgs = [...uMsgs, ...bMsgs];

   let user: myUser | null = null;

   if (isValid) {
      let cred = await createUserWithEmailAndPassword(Auth, email, password); // Firebase auto-signs user in and global user state change @see app.tsx
      let uid = cred.user.uid;
      user = {
         uid: uid,
         username: name,
         verified: false,
         pic: randInt(1,5) as Pic,
         bio: bio || `hello this is ${name}'s bio!`
      }

      try {
         await createDoc<myUser>('users', user, uid);
      } catch (e) { // If document cant be created.
         if (e instanceof FirebaseError) {
            msgs.push(e.message);
         }
         console.log(e);
         deleteUser(cred.user);
         signOut(Auth);
         throw e;
      }
   } else { // I have no clue if this is gonna work
      throw new Error(msgs[0]);
   }

   return [ user, msgs ];

}