import React, { createContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import './app.css';

// Components
import Sidebar from '../components/sidebar/sidebar.component';

// Firebase
import { Firestore as fs, Auth } from '../firebase.config';
import { doc, getDoc } from 'firebase/firestore';

// Initialization // TODO: maybe move this code elsewhere
const UserState = createContext<myUser | null | 'loading'>(null);

const App: React.FC = () => {
   // let [ loading, setLoading ] = useState<boolean>(true); // TODO: add loading animations
   let [ user, setUser ] = useState<myUser | null | 'loading'>('loading');

   useEffect(
      () => {
         let fetchUser = async (uid: string) => {
            let ref = doc(fs, 'users', uid);
            let document = await getDoc(ref);
            let userData = document.data() as myUser;
            setUser(userData);
         }

         Auth.onAuthStateChanged(
            (currentUser) => { 
               if (currentUser) {
                  fetchUser(currentUser.uid);
               } else {
                  setUser(null);
               }
            }
         )
      }, []
   )
   
   return <UserState.Provider value={ user }>
      <div className="app">
         <Sidebar />
         <div className="ctn">
            <Outlet/>
         </div>
      </div>
   </UserState.Provider>
   
}

// TODO: maybe move to context file
export { UserState };
export default App;