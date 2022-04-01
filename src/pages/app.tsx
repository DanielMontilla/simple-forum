import React, { createContext, useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import './app.css';

// Components
import Sidebar from '../components/sidebar/sidebar.component';

// Firebase
import { Firestore as fs, Auth } from '../firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { myUser } from '../types';

// Initialization // TODO: maybe move this code elsewhere
const UserState = createContext<myUser | null | 'loading'>(null);
// myUser: user is signed in
// null: no user signed in
// loading: fetching user status

const App: React.FC = () => {
   let [ user, setUser ] = useState<myUser | null | 'loading'>('loading'); // Global user state
   
   useEffect(
      () => {
         let fetchUser = async (uid: string) => {
            let ref = doc(fs, 'users', uid);
            let document = await getDoc(ref);
            let userData = document.data() as myUser;
            setUser(userData);
         }

         return Auth.onAuthStateChanged(
            (currentUser) => { 
               if (currentUser) {
                  fetchUser(currentUser.uid);
                  Auth.updateCurrentUser(currentUser);
               } else {
                  setUser(null);
               }
            }
         );
      }, []
   )
   
   return <UserState.Provider value={ user }>
      <div className="app">
         <Sidebar state={ false }/>
         <div className="ctn">
            <Outlet/>
         </div>
      </div>
   </UserState.Provider>
   
}

// TODO: maybe move to context file
export { UserState };
export default App;