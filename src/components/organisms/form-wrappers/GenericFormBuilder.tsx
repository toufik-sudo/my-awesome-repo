// import React from 'react';
// import { Formik } from 'formik';
// import * as Yup from 'yup';

// import CustomFormField from 'components/molecules/forms/fields/CustomFormField';
// import DynamicFormattedError from 'components/atoms/ui/DynamicFormattedError';
// import { buildValidationSchema, getInitialValues } from 'services/FormServices';
// import { ICreateAccountForm } from 'interfaces/IModals';
// import { disableSubmitOnEnter, emptyFn } from 'utils/general';

// import style from 'assets/style/components/Modals/Modal.module.scss';
// import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';

// /**
//  * Template component that renders a create account form with a left side layout
//  * @param formDeclaration
//  * @param formAction
//  * @param validateOnMount
//  * @param formSlot
//  * @param insideFormSlot
//  * @param outsideSlot
//  * @param upperSlot
//  * @param classname
//  * @param formClassName
//  * @param disableSubmit
//  * @constructor
//  */
// const GenericFormBuilder = ({
//   formDeclaration,
//   formAction,
//   validateOnMount = false,
//   formSlot = null,
//   insideFormSlot = null,
//   outsideSlot = null,
//   upperSlot = null,
//   classname = '',
//   formClassName = '',
//   disableSubmit = false,
//   ...rest
// }) => {
//   return (
//     <Formik
//       onSubmit={formAction}
//       enableReinitialize
//       validateOnMount={validateOnMount}
//       initialValues={getInitialValues<ICreateAccountForm>(formDeclaration)}
//       validationSchema={Yup.object().shape(buildValidationSchema(formDeclaration))}
//       {...rest}
//     >
//       {form => {
//         const globalError = (form.errors as any).global;

//         return (
//           <>
//             {upperSlot}
//             <form
//               onSubmit={form.handleSubmit}
//               className={formClassName}
//               onKeyPress={e => (disableSubmit ? disableSubmitOnEnter(e) : emptyFn)}
//             >
//               <>
//                 <div className={`${classname || style.inputsWrapper} ${eCardStyle.customTextInput}` 
//               }  style={{ marginTop: '20px' }}>
//                   {formDeclaration.map((field, key) => (
//                     <CustomFormField key={key} form={form} field={field} />
//                   ))}
//                   <DynamicFormattedError hasError={globalError} id={`form.validation.${globalError}`} />
//                   {insideFormSlot}
//                 </div>
//                 {formSlot(form)}
//               </>
//             </form>
//             {outsideSlot}
//           </>
//         );
//       }}
//     </Formik>
//   );
// };

// export default GenericFormBuilder;




import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

import CustomFormField from 'components/molecules/forms/fields/CustomFormField';
import DynamicFormattedError from 'components/atoms/ui/DynamicFormattedError';
import { buildValidationSchema, getInitialValues } from 'services/FormServices';
import { ICreateAccountForm } from 'interfaces/IModals';
import { disableSubmitOnEnter, emptyFn } from 'utils/general';

import style from 'assets/style/components/Modals/Modal.module.scss';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';

const GenericFormBuilder = ({
  formDeclaration,
  formAction,
  validateOnMount = false,
  formSlot = null,
  insideFormSlot = null,
  outsideSlot = null,
  upperSlot = null,
  classname = '',
  formClassName = '',
  disableSubmit = false,
  ...rest
}) => {

  const [measurementName, setMeasurementName] = useState(null);

  useEffect(() => {
    formDeclaration.map(field => {
      if (measurementName == 'action' && field.label == 'amount') {
        field.constraints.required = false;
        field.isHidden = true;
      }
    })
  }, [measurementName])

  return (
    <Formik
      onSubmit={formAction}
      enableReinitialize
      validateOnMount={validateOnMount}
      initialValues={getInitialValues < ICreateAccountForm > (formDeclaration)}
      validationSchema={Yup.object().shape(buildValidationSchema(formDeclaration))}
      {...rest}
    >
      {form => {
        const globalError = (form.errors as any).global;

        return (
          <>
            {upperSlot}
            <form
              onSubmit={form.handleSubmit}
              className={formClassName}
              onKeyPress={e => (disableSubmit ? disableSubmitOnEnter(e) : emptyFn)}
            >
              <>
                <div className={`${classname || style.inputsWrapper} ${eCardStyle.customTextInputUser}`} style={{ marginTop: '20px' }}>
                  {formDeclaration.map((field, key) => (
                    (!field.isHiddenField) &&
                    <CustomFormField
                      key={key}
                      form={form}
                      field={field}
                      measurementName={measurementName}
                      setMeasurementName={setMeasurementName}
                    />
                  ))}
                  <DynamicFormattedError hasError={globalError} id={`form.validation.${globalError}`} />
                  {insideFormSlot}
                </div>
                {formSlot(form)}
              </>
            </form>
            {outsideSlot}
          </>
        );
      }}
    </Formik>
  );
};

export default GenericFormBuilder;
