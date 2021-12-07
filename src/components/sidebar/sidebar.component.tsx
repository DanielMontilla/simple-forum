import React from "react";
import { Outlet, Link } from "react-router-dom";
import './sidebar.style.css';
import { IconType } from "react-icons";

// ICONS
import { BiGridAlt, BiBandAid, BiArrowFromLeft } from 'react-icons/bi';
import { MdOutlinePostAdd } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';

interface SidebarProps {}
interface SidebarState {
   active: boolean
}

export default class Sidebar extends React.Component<SidebarProps, SidebarState> {

   public state: SidebarState = {
      active: true
   }

   public render() {

      let { active } = this.state;

      return <>
         <nav className={`sidebar ${ active ? 'sb-active' : 'sb-inactive' } `}>
            {/* LOGO */}


            {/* SEARCH FEATURE... maybe */}

            {/* NAVIGATION */}
            <ul>
               <Item text="feed" Icon={ BiGridAlt } path="/feed"/>
               <Item text="post" Icon={ MdOutlinePostAdd }/>
               <Item text="profile" Icon={ CgProfile }/>
            </ul>
         </nav>
            {/* SETTINGS & MISC */}

         {/* TOGGLE BUTTON */}
         <div className="tgl-btn" onClick={ () => { this.toggle() } }>
            <BiArrowFromLeft className={`tgl-icon ${ active ? 'tgl-active' : 'tgl-inactive' } `}/>
         </div>

      </>
   }

   public toggle() {
      let { active } = this.state;
      this.setState({ active: !active })
   }
};

const Item: React.FC<{ text: string; Icon?: IconType; path?: string}> = ({
   text,
   Icon = BiBandAid,
   path = '/'
}) => (
   <Link to={ path }>
      <li className="item">
         <Icon className="icon" />
         <div className="tag"> { text } </div>
      </li>
   </Link>
);

