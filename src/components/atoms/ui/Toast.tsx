import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import style from 'sass-boilerplate/stylesheets/layout/Toast.module.scss';

/**
 * Atom component that renders a toast
 *
 * @constructor
 */
const Toast = () => {
  const { toastContainer, toastProgressBar } = style;

  return (
    <ToastContainer
      toastClassName={toastContainer}
      progressClassName={toastProgressBar}
      position="top-right"
      autoClose={8000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      draggable
      pauseOnHover
    />
  );
};

export default Toast;
