import { FC } from "react";

import './notification.style.css';

interface NotificationProps { msgs?: Array<[ msg: string, status?: 'normal' | 'error' | 'succesful' ]> }

const Notification: FC<NotificationProps> = ({ msgs }) => {
   return <>
      {
         msgs ? <div className={`notification-cnt`}>
            {
               msgs.map( (v, i) => <div key={i} 
                  className={`
                  ${ v[1] === 'normal' || !v[1] ? 'text-regular' : ''}
                  ${ v[1] === 'error' ? 'text-error' : ''}
                  ${ v[1] === 'succesful' ? 'text-succ' : ''}
                  `}> {v[0]} </div> 
               )
            }
         </div> :
         <></>
      }
   </>
}

export default Notification;