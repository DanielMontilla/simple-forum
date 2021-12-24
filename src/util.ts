const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const months: Month[] = ['January', 'February', 'March', 'April', 'May','June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days: Day[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

export const rand = (min: number = 0, max: number = 1) => Math.random() * (max - min) + min;

export const randInt = (min: number = 0, max: number = 10) => Math.round(rand(min, max));

export const isEven = (num: number) => (num & (num - 1)) === 0;

export const randPick = <T> (arr: T[]): T => arr[randInt(0, arr.length - 1)];

export const randChar = (
   canBeDigit: boolean = true,
   canBeUpper: boolean = true
): string => {
   let state: 'normal' | 'upper' | 'digit' = 'normal';
   let roll = rand();

   if (1/3 > roll) {
      state = 'digit';
   } else if (1/3 <= roll && roll <= 2/3) {
      state = 'upper';
   }

   switch (state) {
      case 'normal':
         return randPick(letters);
      case 'upper':
         return randPick(letters).toUpperCase();
      case 'digit':
         return randInt(0, 9).toString();
   }
}

export const randID = (lenght: number = 10): string => {
   let val = '';

   for (let i = 0; i < lenght; i++) {
      val += randChar();
   }

   return val;
}