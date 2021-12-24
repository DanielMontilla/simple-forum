type Month = 'January' | 'February' | 'March' | 'April' | 'May' |'June' |
             'July' | 'August' | 'September' | 'October' | 'November' | 'December'

type Day = 1  | 2  | 3  | 4  | 5  | 6  | 7  | 8  | 9  | 10 |
           11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
           21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31

interface mDate {
   day: Day,
   month: Month,
   year: number
}

interface PostData {
   author: DocumentReference
   publishDate: mDate
   editDate: mDate

   title: string
   content: string
   media?: string

   comments: string[]
   likes: number
   dislikes: number
}

interface CommentData {
   author: string,
   content: string
}

type Pic = 1 | 2 | 3 | 4 | 5

interface myUser {
   uid: string
   username: string
   verified: boolean
   pic: Pic
   bio?: string
}

type PostRef = DocumentReference<PostData>;
type PostColRef = CollectionReference<PostData>;
type UserRef = DocumentReference<myUser>;
type UserColRef = CollectionReference<myUser>;