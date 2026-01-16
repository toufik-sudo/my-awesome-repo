import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setLaunchDataStep } from 'store/actions/launchActions';
import { RESULTS_CHANNEL_FIELDS, RESULTS_CHANNEL } from 'constants/wall/launch';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { DOT_SEPARATOR } from 'constants/general';
import { FORM_FIELDS, INPUT_TYPE } from 'constants/forms';
import { IStore } from 'interfaces/store/IStore';

import style from 'assets/style/common/Checkbox.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { IFormDropdownOption } from 'interfaces/forms/IForm';

/**
 * Molecule component used for a checkbox element
 *
 * @param label
 * @param index
 * @param resultChannel
 * @constructor
 */

export const CheckboxButtonAgreement = ({ form, field }) => {
  const { options, label, style: fieldStyle } = field;
  const { checkboxInfo, checkboxLabel, noCheckbox } = style;
  const dispatch = useDispatch();
  const launchStore = useSelector((store: IStore) => store.launchReducer);
  const { values, errors, touched, setFieldValue, handleBlur, onChange } = form;
  const [checked, setChecked] = useState(false)
  const handleChecked = (checkedParam)=>{
    setChecked(checkedParam);
    // setFieldValue(labelParama, checkedParam);
    // onChange(!checked, option);
  }

  return (
    <>
      <label>        
        <input
          className={coreStyle.mr05}
          name={label}
          type={INPUT_TYPE.CHECKBOX}
          checked={checked}
          onChange={() => { setFieldValue("contactAgreement", !checked); handleChecked(!checked)}}
           // Toggle the checkbox state
        />
        <DynamicFormattedMessage tag="span" id={label} className={checkboxLabel} />
      </label>
      
      <DynamicFormattedMessage tag="div" id={`${label}.info`} className={checkboxInfo} />
    </>
  );
};


// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// import { setLaunchDataStep } from 'store/actions/launchActions';
// import { RESULTS_CHANNEL_FIELDS, RESULTS_CHANNEL } from 'constants/wall/launch';
// import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
// import { DOT_SEPARATOR } from 'constants/general';
// import { INPUT_TYPE } from 'constants/forms';
// import { IStore } from 'interfaces/store/IStore';

// import style from 'assets/style/common/Checkbox.module.scss';
// import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
// import { IFormDropdownOption } from 'interfaces/forms/IForm';

// export const CheckboxButtonAgreement = ({ form, field }) => {
//   const { label, style: fieldStyle } = field;
//   const { checkboxInfo, checkboxLabel } = style;
//   const { values, setFieldValue, handleBlur } = form;
  
//   const dispatch = useDispatch();
//   const launchStore = useSelector((store: IStore) => store.launchReducer);
  
//   const isChecked = values[field.name] || false; // Get the value from form.values

//   const handleChecked = (e) => {
//     const isChecked = e.target.checked;
//     setFieldValue(field.name, isChecked); // Update the field's value in Formik form
//   };

//   return (
//     <>
//       <label>
//         <input
//           className={coreStyle.mr05}
//           name={field.name}
//           type={INPUT_TYPE.CHECKBOX}
//           checked={isChecked}
//           value={isChecked.toString()}
//           onChange={handleChecked}  // Update checkbox state
//           onBlur={handleBlur}       // Handle blur for form validation
//         />
//         <DynamicFormattedMessage tag="span" id={label} className={checkboxLabel} />
//       </label>
      
//       <DynamicFormattedMessage tag="div" id={`${label}.info`} className={checkboxInfo} />
//     </>
//   );
// };

