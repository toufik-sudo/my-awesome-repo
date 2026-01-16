import { useState, useEffect, useCallback } from 'react';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import UserDeclarationApi from 'api/UserDeclarationsApi';
import {
  buildDeclarationFieldsOnCreate,
  prepareDeclarationData,
  resolveUserDeclarationCreateErrorMessage
} from 'services/UserDeclarationServices';
import { REQUIRED } from 'constants/validation';
import { USER_DECLARATIONS_ROUTE, WALL_BENEFICIARY_DECLARATIONS_ROUTE } from 'constants/routes';
import { PROGRAM_TYPES, SPONSORSHIP } from 'constants/wall/launch';
import ProgramsApi from 'api/ProgramsApi';
import { validateTextInput } from 'services/FormServices';
import { handleApiFormValidation } from 'utils/validationUtils';

const userDeclarationApi = new UserDeclarationApi();
const programsApi = new ProgramsApi();

/**
 * Hook used to create a single user declaration with dynamic form fields based on the selected product.
 */
const useCreateUserDeclaration = (isBeneficiary) => {
  const history = useHistory();
  const intl = useIntl();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programData, setProgramData] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState(null); // Track the selected product using "productName" key
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState(null);
  const [errors, setErrors] = useState({});
  const [reloadKey, setReloadKey] = useState(0);
  const [declarationFields, setDeclarationFields] = useState({ formFields: [], loading: false });
  // const [measurementName, setMeasurementName] = useState(null);

  console.log(declarationFields)
  

  const onProgramChange = useCallback((program) => {
    setSelectedBeneficiaryId(undefined);
    setSelectedProgram(program);
    setErrors({
      ...errors,
      programError: undefined,
    });
  }, [errors]);

  // const onProductChange = useCallback((product) => {
  //   setSelectedProductName(product.productName); // Using "productName" key from the API
  //   setErrors({
  //     ...errors,
  //     productError: undefined,
  //   });
  //   // const goalWithSelectedProduct = programData?.cube.goals.find(goal =>
  //   //   goal.products.some(product => product.productName === product.productName) // Using "productName"
  //   // );
  //   const measurementName = goalWithSelectedProduct ? goalWithSelectedProduct.measurementName : null;
  //   const initialFormFields = buildDeclarationFieldsOnCreate(declarationFields.formFields, programData.type, measurementName);
  //   setDeclarationFields({ formFields: initialFormFields, loading: false });
    
  // }, [errors]);

  const getMeasurementName = (fields) => {
    const productNameField = fields.find(field => field.label === 'productName');
    
    if (productNameField && productNameField.measurementName) {
      return productNameField.measurementName; 
    }
  
    return null; 
  };

  

  const onBeneficiaryChange = useCallback((beneficiary) => {
    setSelectedBeneficiaryId(beneficiary.uuid);
    setErrors({
      ...errors,
      beneficiaryError: undefined,
    });
  }, [errors]);

  useEffect(() => {
    
    const loadInitialFields = async (programId) => {
      try {
        const { resultsFormFields, ...rest } = await programsApi.getProgramDetails(programId);
        setProgramData(rest);

        // setDeclarationFields({ formFields: initialFormFields, loading: false });

        // Generate the initial fields that don't depend on the product selection
        // const goals = rest?.cube.goals;
        // let measurementName = null;
        // if(goals.length == 1){
        //   measurementName= goals[0].measurementName;
        // }        
        const initialFormFields = buildDeclarationFieldsOnCreate(resultsFormFields, rest.type, null);
        setDeclarationFields({ formFields: initialFormFields, loading: false });
        
      } catch (e) {
        toast(intl.formatMessage({ id: 'wall.userDeclaration.fields.error.failedToLoad' }));
        setDeclarationFields({ formFields: [], loading: false });
      }
    };

    if (selectedProgram) {
      setDeclarationFields({ formFields: [], loading: true });
      loadInitialFields(selectedProgram.id);
    }
    // setMeasurementName(getMeasurementName(declarationFields.formFields));
    // console.log("measure", measurementName)
    
  }, [selectedProgram]);


  const onValidate = async (values, form) => {
    const { setErrors: setFormErrors, errors: formErrors } = form;
    const { productName: productField } = values;

    if (
      programData.type !== PROGRAM_TYPES[SPONSORSHIP] &&
      (!productField || !!productField.productId === !!productField.otherProductName)
    ) {
      const productName = productField.otherProductName ? validateTextInput(productField.otherProductName) : REQUIRED;
      setFormErrors({ ...formErrors, productName });
      return;
    }

    if (!isBeneficiary && (!selectedProgram || !selectedBeneficiaryId)) {
      const programError = !selectedProgram && REQUIRED;
      const beneficiaryError = !selectedBeneficiaryId && REQUIRED;
      setErrors({
        programError,
        beneficiaryError,
      });
      return;
    }

    await onSubmitData(values, form);
  };

  const onSubmitData = async (values, { resetForm, ...rest }) => {
    const beneficiaryData = {
      programId: selectedProgram.id,
      uuid: selectedBeneficiaryId,
    };

    if (isBeneficiary) {
      beneficiaryData.uuid = null;
    }

    try {
      if (programData.type === 3) {
        values.proofOfSale = values.proofOfReferral; 
        delete values.proofOfReferral;               
      }

      if (programData.type === 2) {
        values.proofOfSale = values.proofOfPurchase; 
        delete values.proofOfPurchase;               
      }

      const declarationData = prepareDeclarationData(values, beneficiaryData, programData);
      await userDeclarationApi.createDeclaration(declarationData);
      resetForm();
      setReloadKey(reloadKey + 1);
      toast(intl.formatMessage({ id: 'wall.userDeclaration.add.success' }));
      setSelectedProgram(null);
      history.push(isBeneficiary ? WALL_BENEFICIARY_DECLARATIONS_ROUTE : USER_DECLARATIONS_ROUTE);
    } catch ({ response }) {
      const errorMessage = resolveUserDeclarationCreateErrorMessage(response);
      handleApiFormValidation(rest, values, response);
      toast(intl.formatMessage({ id: errorMessage }));
    }
  };

  return {
    selectedProgram,
    onProgramChange,
    declarationFields,
    onBeneficiaryChange,
    errors,
    reloadKey,
    programData,
    onValidate,
  };
};

export default useCreateUserDeclaration;
