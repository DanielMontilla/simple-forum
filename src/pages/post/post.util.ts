import { Firestore as fs } from '../../firebase.config';
import {
   collection,
   CollectionReference,
   query,
   orderBy,
   limit,
   getDocs,
   startAfter,
   Timestamp,
   addDoc,
   doc,
} from 'firebase/firestore';
import {
   CommentColRef,
   CommentData,
   CommentRef,
   CommentSnap,
   myUser,
   PostData,
   PostRef,
   Rating,
   Vote,
} from '../../types';
import { createDoc, fetchDoc, getRef } from '../../services/Firestore';
import moment from 'moment';

export const fetchComments = async (postId: string) => {
   let colRef = collection(
      fs,
      'posts',
      postId,
      'comments'
   ) as CollectionReference<CommentData>;
   let q = query<CommentData>(colRef, orderBy('date', 'desc'), limit(10));
   let comments = await getDocs(q);

   return comments;
};

export const rate = async (uid: string, pid: string, rating: Rating) => {
   await createDoc<Vote>(`users/${uid}/votes`, { rating: rating }, pid);
};

export const updateVoteCount = async (pid: string, post: PostData, count: number) => {
   post.voteCount += count;
   await createDoc<PostData>('posts', post, pid);
};

export const updateCommentCount = async (pid: string) => {
   let post = await fetchDoc<PostData>('posts', pid);
   post.commentCount += 1;
   await createDoc<PostData>('posts', post, pid);
};

export const fetchCommentRefs = async (
   pid: string,
   amount: number,
   startDoc?: CommentSnap
): Promise<[CommentRef[], CommentSnap]> => {
   let col_ = collection(fs, `posts/${pid}/comments`) as CommentColRef;
   let constrains = [orderBy('publishDate', 'desc'), limit(amount)];
   if (startDoc) constrains.push(startAfter(startDoc));
   let query_ = query<CommentData>(col_, ...constrains);
   let docs_ = await getDocs(query_);

   let refs: CommentRef[] = [];
   let last = docs_.docs[docs_.docs.length - 1];

   docs_.forEach(post => refs.push(post.ref));

   return [refs, last];
};

export const publishComment = async (
   pid: string,
   uid: string,
   content: string,
   publishData?: Timestamp
) => {
   let author = getRef<myUser>('users', uid);
   let date = publishData ? publishData : Timestamp.now();

   let post: CommentData = {
      author: author,
      publishDate: date,
      content: content,
   };

   let _col = collection(fs, `posts/${pid}/comments`) as CommentColRef;
   await updateCommentCount(pid);
   return await addDoc(_col, post);
};

export const validateComment = (content: string): string[] => {
   let msgs: string[] = [];
   if (/^\s*$/.test(content)) {
      msgs.push(`comment can't be empty`);
   } else if (content.trim().length <= 3) {
      msgs.push(`comment must have atleast 3 non-whitespace characters`);
   }

   if (content.length > 256) msgs.push(`comment cant be more than 256 characters`);

   return msgs;
};

export const getPostDuration = (date: Timestamp): string => {
   let now = moment(Date.now());
   let then = moment(date.toDate());

   let { seconds, minutes, hours, days, months, years } = {
      seconds: now.diff(then, 'seconds'),
      minutes: now.diff(then, 'minutes'),
      hours: now.diff(then, 'hours'),
      days: now.diff(then, 'days'),
      months: now.diff(then, 'months'),
      years: now.diff(then, 'years'),
   };

   let res: number;
   let suffix: string;

   if (years > 1) {
      [res, suffix] = [years, 'y'];
   } else if (months > 1) {
      [res, suffix] = [months, 'M'];
   } else if (days > 1) {
      [res, suffix] = [days, 'd'];
   } else if (hours > 1) {
      [res, suffix] = [hours, 'h'];
   } else if (minutes > 1) {
      [res, suffix] = [minutes, 'm'];
   } else {
      [res, suffix] = [seconds, 's'];
   }

   return `${res}${suffix}`;
};
