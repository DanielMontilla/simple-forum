import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';

import App from './pages/app';
import Feed from './pages/feed/feed.page';
import Post from './pages/post/post.page';

import reportWebVitals from './reportWebVitals';

/**
 * @tutorial {router} https://reactrouter.com/docs/en/v6/getting-started/tutorial
 */
render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <App /> } >
          <Route path="feed" element={ <Feed /> } />
          <Route path="/post/:postId" element={ <Post /> } />
          <Route path="account"/>
          <Route path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
