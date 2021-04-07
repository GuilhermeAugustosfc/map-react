import React from 'react';
import ReactDOM from 'react-dom';
import 'fontsource-roboto';
import './index.css';

import ScopedCssBaseline from '@material-ui/core/ScopedCssBaseline';

import Router from './router';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

ReactDOM.render(
  <React.StrictMode>
    <ReactNotification />
    <Router />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
