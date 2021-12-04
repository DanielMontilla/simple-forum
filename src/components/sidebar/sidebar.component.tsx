import React from "react";
import './sidebar.style.css';
import { IconType } from "react-icons";

// ICONS
import { BiGridAlt, BiBandAid, BiArrowFromRight } from 'react-icons/bi';
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

      return <div className="sidebar">
         {/* LOGO */}


         {/* SEARCH FEATURE */}

         {/* NAVIGATION */}
         <ul>
            <Item text="feed" Icon={ BiGridAlt }/>
            <Item text="post" Icon={ MdOutlinePostAdd }/>
            <Item text="profile" Icon={ CgProfile }/>
         </ul>

         {/* SETTINGS & MISC */}

         {/* TOGGLE BUTTON */}
         <div className="tgl-btn" onClick={ () => { this.toggle() } }>
            <BiArrowFromRight className="tgl-icon"/>
         </div>

      </div>
   }

   public toggle() {
      let { active } = this.state;
      this.setState({ active: !active })

      console.log(this.state.active)
   }
};

const Item: React.FC<{ text: string; Icon?: IconType }> = ({
   text,
   Icon = BiBandAid
}) => (
   <li className="item">
      <Icon className="icon" />
      <div className="tag"> {text} </div>
   </li>
);

