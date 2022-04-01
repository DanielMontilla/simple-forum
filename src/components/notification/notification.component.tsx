import { FC } from "react";
import { NotificationConfig } from "../../types";

import './notification.style.css';

interface NotificationProps { msgs?: NotificationConfig[] }

const Notification: FC<NotificationProps> = ({ msgs }) => {
   return <>
      {
         msgs ? <div className={`notification-cnt`}>
            {
               msgs.map( (v, i) => <div key={i} 
                  className={`notif
                  ${ v.status === 'normal' || !v.status ? 'text-regular' : ''}
                  ${ v.status === 'error' ? 'text-error' : ''}
                  ${ v.status === 'succesful' ? 'text-succ' : ''}
                  `}> {
                     v.status === 'error' ? '❌' :
                     v.status === 'succesful' ? '✔' :
                     '🔍'
                  } {v.msg} </div> 
               )
            }
         </div> :
         <></>
      }
   </>
}

export default Notification;