import {  FC, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './sidebar.style.css';
import { IconType } from "react-icons";
import { UserState } from "../../pages/app";

// ICONS
import { BiGridAlt, BiBandAid, BiArrowFromLeft } from 'react-icons/bi';
import { MdOutlinePostAdd } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { AiFillEdit } from 'react-icons/ai';
import { IoLogOut } from 'react-icons/io5';
import { Auth } from "../../firebase.config";

interface SidebarProps {}

interface ItemProps {
   text: string;
   onClick?: () => void;
   icon?: IconType;
   path?: string;
}

const Sidebar: FC<SidebarProps> = () => {
   let user = useContext(UserState);
   let nav = useNavigate();
   let [ active, setActive ] = useState<boolean>(true);

   let toggle = () => setActive(!active);

   let acctElem: JSX.Element;

   switch (user) {
      case null:
         acctElem = <>
            <div className="pic" />
            <div className="username"> anonymous </div>
            <div className="linktainer">
               <IoLogOut className="user-icons"/>
               <div className="user-link" onClick={ () => { nav('/login'); toggle(); } }> signin </div>
            </div>
         </>
         break;

      case 'loading':
         acctElem = <>
            <div className="pic-loading" />
            <div className="username-loading" />
            <div className="linktainer-loading" />
         </>
         break;

      default:
         acctElem = <>
            <div className="pic" />
            <div className="username"> { user.username } </div>
            <div className="user-links"> 
               <div className="linktainer">
                  <AiFillEdit className="user-icons"/>
                  <div className="user-link"> edit </div>
               </div>
               <div className="linktainer">
                  <IoLogOut className="user-icons"/>
                  <div className="user-link" onClick={ () => { nav('/feed'); Auth.signOut(); toggle(); } }> signout </div>
               </div>
            </div>
         </>
         break;
   }

   return <>
      <nav className={`sidebar ${ active ? 'sb-active' : 'sb-inactive' } `}>
         {/* ACCOUNT THINGS */}
         <div className="account-area">
            { acctElem }
         </div>

         {/* NAVIGATION */}
         <ul>
            <Item text="feed" icon={ BiGridAlt } path="/feed" onClick={ toggle } />
            <Item text="post" icon={ MdOutlinePostAdd } onClick={ toggle } />
            <Item text="profile" icon={ CgProfile } onClick={ toggle } />
         </ul>
      </nav>
         {/* SETTINGS & MISC */}

      {/* TOGGLE BUTTON */}
      <div className="tgl-btn" onClick={ toggle }>
         <BiArrowFromLeft className={`tgl-icon ${ active ? 'tgl-active' : 'tgl-inactive' } `}/>
      </div>
   </>
}

export default Sidebar;

let Item: FC<ItemProps> = ({
   text,
   onClick = () => { console.warn(`no callback for this item :(`) },
   icon: Icon = BiBandAid,
   path = '/'
}) => {
   return (
      <Link to={ path } onClick={ onClick }>
         <li className="item">
            <Icon className="icon" />
            <div className="tag"> {text} </div>
         </li>
      </Link>
   );
};
