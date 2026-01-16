import React, { useEffect } from 'react';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import modalStyle from 'sass-boilerplate/stylesheets/components/modals/Modals.module.scss';

const WebFormComponent = ({ url }) => {
  const { mh80vh, overflowYauto, pr3, pt2, pb2 } = coreStyle;
  const script = document.createElement('script');
  script.src = 'https://webforms.pipedrive.com/f/loader';
  script.async = true;
  useEffect(() => {
    return () => {
      const scriptLoaded = document.querySelectorAll("script[src='https://webforms.pipedrive.com/f/loader']");
      scriptLoaded.forEach(script => script.remove());
    };
  }, []);
  const webForm = <div className="pipedriveWebForms" data-pd-webforms={`https://webforms.pipedrive.com/f/${url}`} />;
  document.body.appendChild(script);

  return <div className={`${mh80vh} ${overflowYauto} ${pr3} ${pt2} ${pb2} ${modalStyle.modalPricing}`}>{webForm}</div>;
};

export default WebFormComponent;
