import React from "react";
import { Link } from "react-router-dom";
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

interface ItemProps {
   text: string;
   icon?: IconType;
   path?: string;
}

export default class Sidebar extends React.Component<SidebarProps, SidebarState> {

   public state: SidebarState = {
      active: false
   }

   public render() {

      let { active } = this.state;
      let Item = this.item;
      let toggle = this.toggle.bind(this);

      return <>
         <nav className={`sidebar ${ active ? 'sb-active' : 'sb-inactive' } `}>
            {/* LOGO */}


            {/* SEARCH FEATURE... maybe */}

            {/* NAVIGATION */}
            <ul>
               <Item text="feed" icon={ BiGridAlt } path="/feed" />
               <Item text="post" icon={ MdOutlinePostAdd }/>
               <Item text="profile" icon={ CgProfile }/>
            </ul>
         </nav>
            {/* SETTINGS & MISC */}

         {/* TOGGLE BUTTON */}
         <div className="tgl-btn" onClick={ toggle }>
            <BiArrowFromLeft className={`tgl-icon ${ active ? 'tgl-active' : 'tgl-inactive' } `}/>
         </div>

      </>
   }

   public toggle() {
      let { active } = this.state;
      this.setState({ active: !active })
   }

   private item: React.FC<ItemProps> = ({ text, icon: Icon = BiBandAid, path = '/'}) => {
      let toggle = this.toggle.bind(this);

      return (
         <Link to={ path } onClick={ toggle }>
            <li className="item">
               <Icon className="icon" />
               <div className="tag"> { text } </div>
            </li>
         </Link>
      )
   }
}
