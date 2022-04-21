import { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWindowSize from '../../hooks/windowSize';
import { UserState } from '../../pages/app';
import { BiArrowFromLeft, BiGridAlt } from 'react-icons/bi';
import { IoLogOut, IoToggle } from 'react-icons/io5';
import './sidebar.style.css';
import SidebarItem from '../sidebaritem/sidebaritem.component';
import { MdOutlinePostAdd } from 'react-icons/md';
import { fetchImgUrl } from '../../services/Storage';
import { BsFillEyeFill } from 'react-icons/bs';
import { Auth } from '../../firebase.config';
import { CgProfile } from 'react-icons/cg';
import { AiOutlineQuestionCircle } from 'react-icons/ai';

interface SidebarProps {
   state?: boolean;
}

const notLoggedInName = 'Anonymous';

const isCollapsed = (currentWidth: number) => currentWidth < 1024;

const Sidebar: FC<SidebarProps> = ({ state }) => {
   let [active, setActive] = useState<boolean>(false);
   let [picURL, setPicURL] = useState<string | null>(null); // null === loading

   let windowWidth = useWindowSize().width;
   let user = useContext(UserState);
   let nav = useNavigate();

   useEffect(() => {
      const load = async (n: number) => setPicURL(await fetchImgUrl(`pic_${n}.png`));
      if (user && user !== 'loading') {
         load(user.pic);
      } else if (user === null) {
         load(0);
      }
   }, [user]);

   const toggle = () => {
      if (isCollapsed(windowWidth)) setActive(!active);
   };

   const goToProfile = () => {
      if (user && user !== 'loading') nav('me');
      toggle();
   };

   const signOut = () => {
      Auth.signOut();
      nav('feed');
      toggle();
   };

   const signIn = () => {
      nav('login');
      toggle();
   };

   return (
      <>
         <div
            className={`
            sb-ctn 
            ${isCollapsed(windowWidth) ? (active ? 'sb-active' : 'sb-inactive') : ''}
         `}>
            <div className='sb-acct-area'>
               <div
                  className={`sb-acct-top ${
                     user && user !== 'loading' ? 'cursor-pointer' : ''
                  }`}
                  onClick={goToProfile}>
                  {picURL ? (
                     <img src={picURL} className='sb-user-pic' alt='idk' />
                  ) : (
                     <div className='sb-user-pic-loading' />
                  )}
                  {user === 'loading' ? (
                     <div className='sb-user-name-loading' />
                  ) : !user ? (
                     <div className='sb-user-name-out'> {notLoggedInName} </div>
                  ) : (
                     <div className='sb-user-name'> {user.username} </div>
                  )}
               </div>
               <div className='sb-acct-bot'>
                  {user === 'loading' ? (
                     <div className='sb-user-link-loading' />
                  ) : !user ? (
                     <div className='sb-user-link-loggedout' onClick={signIn}>
                        <div className='flex flex-row items-center group select-none gap-1 group cursor-pointer'>
                           <IoLogOut className='sb-user-icon' />
                           <div className='sb-acct-bot-text'>signin / signup</div>
                        </div>
                     </div>
                  ) : (
                     <div className='sb-user-link-loggedin'>
                        <div
                           className='flex flex-row items-center group select-none gap-1 group cursor-pointer'
                           onClick={signOut}>
                           <IoLogOut className='sb-user-icon' />
                           <div className='sb-acct-bot-text'>signout</div>
                        </div>
                        <div className='sb-user-link-item group' onClick={goToProfile}>
                           <BsFillEyeFill className='sb-user-icon ' />
                           <div className='sb-acct-bot-text'>profile</div>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            <div className='sb-separator'></div>

            <SidebarItem text='FEED' icon={BiGridAlt} path='/feed' callback={toggle} />
            <SidebarItem
               text='POST'
               icon={MdOutlinePostAdd}
               path='/new-post'
               callback={toggle}
            />
            <SidebarItem text='PROFILE' icon={CgProfile} path='/me' callback={toggle} />
            <SidebarItem
               text='ABOUT'
               icon={AiOutlineQuestionCircle}
               path='/about'
               callback={toggle}
            />
         </div>
         {isCollapsed(windowWidth) ? (
            <>
               <div className='tgl-btn' onClick={toggle}>
                  <BiArrowFromLeft
                     className={`tgl-icon ${active ? 'tgl-active' : 'tgl-inactive'} `}
                  />
               </div>
               <div className={`dimmer ${active ? 'opacity-50' : 'opacity-0'}`} />
            </>
         ) : (
            <></>
         )}
      </>
   );
};

export default Sidebar;
