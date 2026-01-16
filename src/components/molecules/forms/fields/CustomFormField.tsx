// import React, { useEffect, useMemo, useState } from 'react';

// import DatePickerMultiple from 'components/molecules/forms/fields/DatepickerMultiple/DatePickerMultiple';
// import DatePickerDefault from 'components/molecules/forms/fields/DatePickerDefault';
// import DefaultInputField from 'components/molecules/forms/fields/DefaultInputField';
// import DropdownInputField from 'components/molecules/forms/fields/DropdownInputField';
// import DynamicDatePickerDefault from 'components/molecules/forms/fields/DynamicDatePickerDefault';
// import RadioButtonInputField from 'components/molecules/forms/fields/RadioButtonInputField';
// import RadioTextInputField from 'components/molecules/forms/fields/RadioTextInputField';
// import ExtendedInputField from './ExtendedInputField';
// import FileInputField from 'components/molecules/forms/fields/FileInputField';
// import DeclarationProductField from 'components/molecules/forms/fields/DeclarationProductField';
// import { INPUT_TYPE } from 'constants/forms';

// /**
//  * Template component used to render a input field
//  *
//  * @param form
//  * @param field
//  * @constructor
//  */
// const CustomFormField = ({ form, field, name = '' }) => {

//     const [measurementName, setMeasurementName] = useState(field.measurementName);
//     console.log(field.label+" ==> "+measurementName)
//     console.log("--------------------")
    
//   useEffect(() => {
//     if (field.measurementName) {
//       setMeasurementName(field.measurementName);
//     }
//     // console.log("why so serious ", measurementName)
//   }, [field.measurementName]);

//   if(measurementName == 'action' && field.label == 'amount'){
//     console.log("DKHALL")
//     field.contraints.required = false;
//     field.isHidden = true;
//   }
  
 
//   switch (field.type) {
//     case INPUT_TYPE.DROPDOWN:
//       return <DropdownInputField {...{ field, form }} />;
//     case INPUT_TYPE.RADIO:
//       return <RadioButtonInputField {...{ field, form }} />;
//     case INPUT_TYPE.DATETIME:
//       return <DatePickerDefault {...{ field, form }} />;
//     case INPUT_TYPE.RADIO_TEXT:
//       return <RadioTextInputField {...{ field, form }} />;
//     case INPUT_TYPE.DYNAMIC_DATETIME:
//       return <DynamicDatePickerDefault {...{ field, form }} />;
//     case INPUT_TYPE.MULTIPLE_DATETIME:
//       return <DatePickerMultiple {...{ field, form }} />;
//     case INPUT_TYPE.EXTENDED_INPUT_FIELD:
//       return <ExtendedInputField {...{ field, form }} />;
//     case INPUT_TYPE.FILE:
//       return <FileInputField {...{ field, form }} />;
//     case INPUT_TYPE.DECLARATION_PRODUCT:
//       return <DeclarationProductField {...{ field, form }} />;
//     default:
//       return <DefaultInputField {...{ field, form, name }} />;
//   }
  
// };

// export default CustomFormField;


import React, { useEffect, useState } from 'react';

import DatePickerMultiple from 'components/molecules/forms/fields/DatepickerMultiple/DatePickerMultiple';
import DatePickerDefault from 'components/molecules/forms/fields/DatePickerDefault';
import DefaultInputField from 'components/molecules/forms/fields/DefaultInputField';
import DropdownInputField from 'components/molecules/forms/fields/DropdownInputField';
import DynamicDatePickerDefault from 'components/molecules/forms/fields/DynamicDatePickerDefault';
import RadioButtonInputField from 'components/molecules/forms/fields/RadioButtonInputField';
import RadioTextInputField from 'components/molecules/forms/fields/RadioTextInputField';
import ExtendedInputField from './ExtendedInputField';
import FileInputField from 'components/molecules/forms/fields/FileInputField';
import DeclarationProductField from 'components/molecules/forms/fields/DeclarationProductField';
import { INPUT_TYPE } from 'constants/forms';
import { useDeclarationProductFieldData } from 'hooks/declarations/useDeclarationProductFieldData';
import { CheckboxButton } from './CheckboxButton';
import { CheckboxButtonAgreement } from './CheckboxButtonAgreement';

/**
 * Template component used to render an input field
 *
 * @param form
 * @param field
 * @param measurementName
 * @param onMeasurementChange
 * @constructor
 */
const CustomFormField = ({ form, field, name = '', measurementName = null, setMeasurementName = null}) => {  

 // console.log("HAW SWITCHI        "+ field.label)
//  console.log(field)
  switch (field.type) {
    case INPUT_TYPE.CHECKBOX:
      return (
        <CheckboxButtonAgreement {...{ field, form }}
        />
      );
    case INPUT_TYPE.DROPDOWN:
      return <DropdownInputField {...{ field, form }} />;
    case INPUT_TYPE.RADIO:
      return <RadioButtonInputField {...{ field, form }} />;
    case INPUT_TYPE.DATETIME:
      return <DatePickerDefault {...{ field, form }} />;
    case INPUT_TYPE.RADIO_TEXT:
      return <RadioTextInputField {...{ field, form }} />;
    case INPUT_TYPE.DYNAMIC_DATETIME:
      return <DynamicDatePickerDefault {...{ field, form }} />;
    case INPUT_TYPE.MULTIPLE_DATETIME:
      return <DatePickerMultiple {...{ field, form }} />;
    case INPUT_TYPE.EXTENDED_INPUT_FIELD:
      return <ExtendedInputField {...{ field, form }} />;
    case INPUT_TYPE.FILE:
      return <FileInputField {...{ field, form }} />;
    case INPUT_TYPE.DECLARATION_PRODUCT:
      return <DeclarationProductField {...{ field, form, setMeasurementName }} />;
    default:
      let isHiddenField = false;
      let isNoErrorsField = false;
      if((measurementName == "action") && field.label == 'amount'){
        field.constraints.required = false;
        field.isHidden = true;
        field.hidden = true;
        isHiddenField = true;
        isNoErrorsField = true;
      } else if((measurementName == "action" || measurementName == "quantity") && field.label == 'amount'){
        field.constraints.required = false;
        isNoErrorsField = true;
      } else if((measurementName == "volume") && field.label == 'quantity'){
        field.constraints.required = false;
        isNoErrorsField = true;
      }
      return <DefaultInputField {...{ field, form, name,  isHiddenField : isHiddenField, isNoErrorsField }} />;
  }
};

export default CustomFormField;
