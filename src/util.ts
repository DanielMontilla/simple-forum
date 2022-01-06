import { Timestamp } from "firebase/firestore";

export const rand = (min: number = 0, max: number = 1) => Math.random() * (max - min) + min;

export const randInt = (min: number = 0, max: number = 10) => Math.round(rand(min, max));

export const isEven = (num: number) => (num & (num - 1)) === 0;

export const randPick = <T> (arr: T[]): T => arr[randInt(0, arr.length - 1)];

// Global validation stuff

export const isUsernameValid = (s: string): [ res: boolean, msgs: string[] ] => {
   let res = true;
   let msgs = [];
   if (s.length < 3) { res = false; msgs.push('username must be more than 3 characters')};
   if (s.length > 10) { res = false; msgs.push('username must be less than 10 characters')};
   /**
    * @copyright https://stackoverflow.com/questions/23476532/check-if-string-contains-only-letters-in-javascript
    */
   if (!/^[a-z]+$/i.test(s)) { res = false; msgs.push('username must only contain letters')};
   
   return [res, msgs];
}

export const isBioValid = (s: string): [ res: boolean, msgs: string[] ] => {
   let res = true;
   let msgs = [];
   if (s.length > 120) { res = false; msgs.push(`bio is ${s.length} characters. Must be less than 120`)};
   return [res, msgs]
}

const myMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const parseTimestamp = (timeStamp: Timestamp): string => {
   let date = timeStamp.toDate();

   // Ej. Jan 4, 2022
   return `${myMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}