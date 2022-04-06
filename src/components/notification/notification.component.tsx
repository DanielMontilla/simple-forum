import { FC, useEffect, useState } from "react";
import { NotificationConfig } from "../../types";

import './notification.style.css';

interface NotificationProps { msgs?: NotificationConfig[], delay?: number}

const Notification: FC<NotificationProps> = ({ msgs, delay }) => {
   let [ fade, setFade ] = useState<boolean>(false);

   useEffect(
      () => {
         if (delay) {
            let timer = setTimeout( () => setFade(true),  delay);
            return () => clearTimeout(timer);
         }
         // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []
   )

   return <>
      {
         msgs ? <div className={`notification-cnt ${fade ? 'notification-fadeout' : 'notification-visible'}`}>
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