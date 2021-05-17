import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "./shared.scss"
import {SnackbarProvider} from "notistack";

export const API = process.env.PEAK_SNIFFER_API || "https://peaksniffer.bakezq.fun"


console.log(process.env.PEAK_SNIFFER_API, process.env)


ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={5}>
      <App/>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
