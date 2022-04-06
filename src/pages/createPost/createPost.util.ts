import { DocumentReference, Timestamp, addDoc, collection, doc } from "firebase/firestore";
import { Firestore as fs } from "../../firebase.config";
import { createDoc, getRef } from "../../services/Firestore";
import { CommentData, myUser, PostColRef, PostData, UserRef } from "../../types";
import { randInt, randPick } from "../../util";
import { faker } from '@faker-js/faker';

export const validateTitle = (title: string): string[] => {
   let msgs: string[] = [];
   
   if (/^\s*$/.test(title)) {
      msgs.push(`title can't be empty`);
   } else if (title.trim().length < 3) {
      msgs.push(`title must have atleast 3 non-whitespace characters`);
   }

   if (title.includes('<br>')) msgs.push(`title can't have linebreaks`);
   if (title.length > 25) msgs.push(`title can't be more than 25 characters`);

   return msgs;
}

export const validateContent = (content: string): string[] => {
   let msgs: string[] = [];
   
   if (/^\s*$/.test(content)) {
      msgs.push(`post can't be empty`);
   } else if (content.trim().length <= 15) {
      msgs.push(`post must have atleast 15 non-whitespace characters`);
   }

   if (content.length > 500) msgs.push(`post cant be more than 500 characters`)

   return msgs;
}

export const publishPost = async (
   uid: string,
   title: string,
   content: string
) => {
   
   let author = getRef<myUser>('users', uid);
   let date = Timestamp.now();
   
   let post: PostData = {
      author: author,
      publishDate: date,
      editDate: date,
      title: title,
      content: content,
      voteCount: 0,
      commentCount: 0
   }
   
   let _col = collection(fs, 'posts') as PostColRef;
   return await addDoc(_col, post);
}

export const publishCustomPost = async (post: PostData) => {
   let _col = collection(fs, 'posts') as PostColRef;
   return await addDoc(_col, post);
}

const UIDS = [
   "0ElW5klDbRUDWFg43mTxUGs4R4w1",
   "3ewSJqaFcuRdkrgPhtl0Bx78mm82",
   "7iXK1Om03JXWlLGNH6xcbnIMWHt1",
   "9zCIn0XDcXa3SFeeutIp04gpuv92",
   "Abb0dVfMMqa5ACGKRRVsc9tnGFE3",
   "AxwJ0GG1MnZkcwiuxVbW7Ns3Q6H2",
   "IlQPdCls8bTDoVxHLHRGouqfBcg1",
   "J2hTv3EWc2bAoRAfvbch7R8uJ4G3",
   "JTO6L8UbeVVsW7k3WGDfgd33E922",
   "KWWEOvlp6TM5wd7ev35ypYUGqct2",
   "NH9pUtQdZxVXx9Blc5TzMjKT9w12",
   "O4QC9Jb09wY39WxLxQJ0yuomfZj1",
   "OwBORM5GJ7bx12MMyOac9293kT63",
   "RcmvYE0YbvYukt0L0lRmDDuyzuF3",
   "TqX45Ddq45cY38SVHalof6a4qV72",
   "U5qMa2ZqwzTbSsOAuvkQCHS2D0h2",
   "cPcU6odPbWY7AM9iVFJlwP2vt953",
   "fuwWKNVC3ihW461g4pHpsONb1zl2",
   "iARd2ZDiX9hCQMpR74oF2UqR8Q53",
   "lS05ulqSxIg9ag1uhpfDUE7biIp1",
   "oXZJvMkGv6UqE2wvXmWj9lTZNne2",
   "z6y13p635lbhLCzlrYNlzmwHrc22",
   "zYEkca79n7WK3GSx1osIh0yvDYJ2"
];

export const generateRandomComment = (since: Timestamp): CommentData => {
   let [from, to] = [since.toDate().toUTCString(), new Date(Date.now()).toUTCString()];

   let content = randPick([faker.lorem.paragraph(randInt(1,7)), faker.lorem.words(randInt(3, 13))]);

   return {
      author: doc(fs, 'users', randPick(UIDS)) as UserRef,
      content: content,
      publishDate: Timestamp.fromDate(faker.date.between(from, to))
   }
}

export const generateRandomPost = (): PostData => {
   let author = doc(fs, 'users', randPick(UIDS)) as UserRef;
   let date = Timestamp.fromDate(faker.date.past(7));
   let title = faker.lorem.words(randInt(2, 4));
   let content = faker.lorem.paragraph(randInt(1,13));
   let votes = randInt(0, 1000)

   return {
      author: author,
      publishDate: date,
      editDate: date,
      title: title,
      content: content,
      voteCount: votes,
      commentCount: 0
   }
}