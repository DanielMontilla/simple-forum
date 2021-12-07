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

export const randDate = (minYear: number, maxYear: number): mDate => {
   return {
      day: randPick(days),
      month: randPick(months),
      year: randInt(minYear, maxYear)
   }
}

export const dummyPost = (): PostData => {

   return {
      post_id: randID(),
      author_id: randID(),
      publish_date: randDate(2015, 2021),
      edit_date: randDate(2021, 2021),
   
      title: 'Title',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam arcu odio, ornare vitae pretium sit amet, dictum sit amet ligula. Nunc nisi turpis, elementum at faucibus sed, varius quis libero. Mauris sit amet sollicitudin ex. Nulla consequat ex eget libero blandit ullamcorper quis id ligula. Suspendisse non odio sed massa euismod ultrices sed id eros. Suspendisse quis ante nec nulla tempor porttitor at malesuada lacus. Maecenas condimentum tempus odio, non egestas tellus fringilla et. Maecenas at nunc fringilla risus pretium porttitor. Vestibulum lacinia arcu vitae pharetra sagittis.'
   }
}