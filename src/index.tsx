import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./shared.scss"
import {SnackbarProvider} from "notistack";

export const API = process.env.PEAK_SNIFFER_API || "http://127.0.0.1:8000"



ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={5}>
      <App/>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);