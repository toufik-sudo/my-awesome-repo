// import React from 'react';

// import DesignTextField from 'components/molecules/launch/design/DesignTextField';
// import CompanyTitle from 'components/molecules/launch/design/CompanyTitle';
// import DesignIdentificationPreview from 'components/molecules/launch/design/DesignIdentificationPreview';
// import useTitleContentData from 'hooks/launch/wall/useTitleContentData';
// import { DESIGN_TITLE, DESIGN_TEXT } from 'constants/wall/launch';
// import { DesignIdentificationContext } from 'components/pages/DesignIdentificationPage';

// import style from 'sass-boilerplate/stylesheets/pages/DesignIdentification.module.scss';

// /**
//  * Organism component used to render Design Identification wrapper
//  *
//  * @param designNameState
//  * @param designTextState
//  * @param hasError
//  * @param hasContentError
//  * @constructor
//  */
// const DesignIdentificationWrapper = ({ designNameState, designTextState, hasError, hasContentError }) => {
//   const { title, setTitle, content, setContent } = useTitleContentData(designNameState, designTextState);
//   const { designIdentificationWrapper, designIdentificationInfo } = style;

//   return (
//     <div className={designIdentificationWrapper}>
//       <div className={designIdentificationInfo}>
//         <CompanyTitle
//           {...{
//             companyName: title,
//             setCompanyName: setTitle,
//             type: DESIGN_TITLE,
//             hasError
//           }}
//         />
//         <DesignTextField
//           {...{
//             companyName: content,
//             setCompanyName: setContent,
//             type: DESIGN_TEXT,
//             hasContentError
//           }}
//         />
//       </div>
//       <DesignIdentificationPreview context={DesignIdentificationContext} />
//     </div>
//   );
// };

// export default DesignIdentificationWrapper;


import React from 'react';

import DesignTextField from 'components/molecules/launch/design/DesignTextField';
import CompanyTitle from 'components/molecules/launch/design/CompanyTitle';
import DesignIdentificationPreview from 'components/molecules/launch/design/DesignIdentificationPreview';
import useTitleContentData from 'hooks/launch/wall/useTitleContentData';
import { DESIGN_TITLE, DESIGN_TEXT } from 'constants/wall/launch';
import { DesignIdentificationContext } from 'components/pages/DesignIdentificationPage';

import style from 'sass-boilerplate/stylesheets/pages/DesignIdentification.module.scss';

/**
 * Organism component used to render Design Identification wrapper
 *
 * @param designNameState
 * @param designTextState
 * @param hasError
 * @param hasContentError
 * @constructor
 */
const DesignIdentificationWrapper = ({ designNameState, designTextState, hasError, hasContentError }) => {
  const { title, setTitle, content, setContent } = useTitleContentData(designNameState, designTextState);
  const { designIdentificationWrapper, designIdentificationInfo, designIdentificationPreview } = style;

  const cropStyle = {
    maxHeight: '100%', // Adjust the maximum height as needed
    overflow: 'hidden',
  };

  return (
    <div className={designIdentificationWrapper}>
      <div className={designIdentificationInfo}>
        <CompanyTitle
          {...{
            companyName: title,
            setCompanyName: setTitle,
            type: DESIGN_TITLE,
            hasError
          }}
        />
        <DesignTextField
          {...{
            companyName: content,
            setCompanyName: setContent,
            type: DESIGN_TEXT,
            hasContentError
          }}
        />
      </div>
      <div className={designIdentificationPreview} style={cropStyle}>
        <DesignIdentificationPreview context={DesignIdentificationContext} />
      </div>
    </div>
  );
};

export default DesignIdentificationWrapper;
