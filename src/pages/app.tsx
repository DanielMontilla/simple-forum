import React from 'react';
import { Outlet } from 'react-router';
import './app.css';

import Sidebar from '../components/sidebar/sidebar.component';


const App: React.FC = () => <div className="app">
   <Sidebar />
   <div className="ctn">
      <Outlet/>
   </div>
</div>

export default App;