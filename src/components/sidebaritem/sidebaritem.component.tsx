import { FC } from 'react';
import { IconType } from 'react-icons';
import { useNavigate } from 'react-router-dom';
import './sidebaritem.style.css';

interface ItemProps {
   text: string;
   icon: IconType;
   path?: string;
   callback?: Function;
}

const SidebarItem: FC<ItemProps> = ({
   text,
   icon: Icon,
   path = '/',
   callback = () => {}
}) => {
   let nav = useNavigate();
   
   return <div 
      className='sbi-ctn'
      onClick={ 
         () => {
            nav(path);
            callback();
         }
      }
   >
      <Icon className='sbi-icon'/>
      <div className='sbi-text'> { text } </div>
   </div>;
};

export default SidebarItem;
