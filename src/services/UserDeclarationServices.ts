import moment from 'moment';

import MomentUtilities from 'utils/MomentUtilities';
import {
  USER_DECLARATION_STATUS,
  USER_DECLARATION_SOURCE,
  ERROR_CODES,
  ACCEPTED_DECLARATION_UPLOAD_TYPES,
  ACCEPTED_DECLARATION_UPLOAD_MB_SIZE,
  UPLOAD_DECLARATIONS_ERROR_CODES
} from 'constants/api/declarations';
import {  USER_DECLARATION_FIELDS_CHALLENGE, USER_DECLARATION_FIELDS_CHALLENGE_ACTION, USER_DECLARATION_FIELDS_SPONSORSHIP, USER_DECLARATION_FIELDS_PARRAINAGE } from 'constants/formDefinitions/formDeclarations';
import { DEFAULT_ISO_DATE_FORMAT, FORM_FIELDS, TIME_FORMAT } from 'constants/forms';
import { DECLARATION_PROOF_FILE_FIELD } from 'constants/formDefinitions/genericFields';
import { CHALLENGE, LOYALTY, PROGRAM_TYPES, SPONSORSHIP } from 'constants/wall/launch';
import { extractErrorCode } from 'utils/api';
import { convertBytesToMb, hasExtension, convertMbToBytes } from 'utils/files';
import useProgramDetails from 'hooks/programs/useProgramDetails';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import MeasurementType from 'components/organisms/launch/cube/MeasurementType';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useIntl } from 'react-intl';


export { getDMYDateFormat } from 'services/WallServices';



/**
 * Resolves the display settings (class, message id) corresponding to the given declaration status
 * @param declarationStatus
 * @param style
 */


export const getUserDeclarationStatusSettings = (declarationStatus: USER_DECLARATION_STATUS, style: any = {}) => {
  const { declarationRowStatusPending, declarationRowStatusAllocated, declarationRowStatusDeclined, declarationRowStatusValidated } = style;
  



  let statusStyle = '';
  let statusDescriptionId = `userDeclaration.status.${declarationStatus}`;

  if (isPendingUserDeclarationStatus(declarationStatus)) {
    statusStyle = declarationRowStatusPending;
  }

  if(isAllocatedUserDeclarationStatus(declarationStatus)) {
    statusStyle = declarationRowStatusAllocated;
  }

  if (isDeclinedUserDeclationStatus(declarationStatus)) {
    statusStyle = declarationRowStatusDeclined;
  }

  if (isValidatedUserDeclarationStatus(declarationStatus)) {
    statusStyle = declarationRowStatusValidated;
    // statusDescriptionId = `userDeclaration.status.${USER_DECLARATION_STATUS.VALIDATED}`;
  }

  return { statusStyle, statusDescriptionId };
};

const isValidatedUserDeclarationStatus = (declarationStatus: USER_DECLARATION_STATUS): boolean =>
  declarationStatus === USER_DECLARATION_STATUS.VALIDATED 

const isAllocatedUserDeclarationStatus = (declarationStatus: USER_DECLARATION_STATUS): boolean => 
  declarationStatus === USER_DECLARATION_STATUS.POINTS_ALLOCATED

const isDeclinedUserDeclationStatus = (declarationStatus: USER_DECLARATION_STATUS): boolean =>
  declarationStatus === USER_DECLARATION_STATUS.DECLINED;

export const isPendingUserDeclarationStatus = (declarationStatus: USER_DECLARATION_STATUS): boolean =>
  declarationStatus === USER_DECLARATION_STATUS.PENDING;

/**
 * Returns the configuration for the user declaration fields to display
 * @param fieldsToDisplay
 */
export const buildDeclarationFields = (fieldsToDisplay: string[] = [],type,measurementName) => {
  // const { selectedProgramId } = useWallSelection();
  // const detail = useProgramDetails(selectedProgramId);
  
  // const detail = useProgramDetails(selectedProgramId)
  // if(detail.programDetails.type==1 || detail.programDetails.type==2 ){
    if(type == 1 || type == 2){
      let val = null;
      if(measurementName==="action"){
      
      val= Object.keys(USER_DECLARATION_FIELDS_CHALLENGE_ACTION)
      .filter(field => fieldsToDisplay.includes(field))
      .map(field => USER_DECLARATION_FIELDS_CHALLENGE_ACTION[field]); 

      return val}
      else {
        return Object.keys(USER_DECLARATION_FIELDS_CHALLENGE)
      .filter(field => fieldsToDisplay.includes(field))
      .map(field => USER_DECLARATION_FIELDS_CHALLENGE[field]); }
      }

    if(type == 3){
      return Object.keys(USER_DECLARATION_FIELDS_SPONSORSHIP)
      .filter(field => fieldsToDisplay.includes(field))
      .map(field => USER_DECLARATION_FIELDS_SPONSORSHIP[field]); 
    }
    
  }
  ;
  
/**
 * Returns the configuration for the user declaration fields to display on create
 * @param fieldsToDisplay
 * @param type
 */
export const buildDeclarationFieldsOnCreate = (fieldsToDisplay: string[] = [], type:any , measurementName:any) => {
  // console.log("TYPE1")
  const fields = buildDeclarationFields(fieldsToDisplay,type,measurementName);
  // console.log("TYPE2")
  const isProofFileRequired = fieldsToDisplay.includes(FORM_FIELDS.PROOF_OF_SALE);
  if (isProofFileRequired) {
    if(type!=3){
      fields.push(DECLARATION_PROOF_FILE_FIELD(true, type));
    }else{
      fields.push(DECLARATION_PROOF_FILE_FIELD(false, type));
    }
    
  }

  return fields;
};

/**
 * Translates user declaration create error codes to message
 * @param response
 */
export const resolveUserDeclarationCreateErrorMessage = response => {
  const errorCode = extractErrorCode(response);

  if (errorCode === ERROR_CODES.PROOF_FILE_LARGE || errorCode === ERROR_CODES.PROOF_FILE_INVALID_TYPE) {
    return `wall.userDeclaration.add.error.${errorCode}`;
  }

  return 'wall.userDeclaration.add.error.general';
};

/**
 * Resolves the declaration data for given field
 * @param declaration
 * @param fieldName
 */
export const extractDeclarationDataForField = (declaration: any = {}, fieldName: string, parsedAdditionalComments) => {
  const {formatMessage} = useIntl()
  const sponsorshipDetails = parsedAdditionalComments?.[0];
  console.log(parsedAdditionalComments)
  // console.log("Hada field :"+fieldName)
  if (fieldName === FORM_FIELDS.PRODUCT_NAME && !declaration[fieldName]) {
    return (declaration.product && declaration.product.name) || declaration.otherProductName;
  }

  if (fieldName === FORM_FIELDS.TIME_OF_SALE && !declaration[fieldName]) {
    return MomentUtilities.formatDate(declaration.dateOfEvent, TIME_FORMAT);
  }

  if (fieldName === FORM_FIELDS.DATE_OF_EVENT) {
    return declaration.dateOfEvent && moment(declaration.dateOfEvent).format(DEFAULT_ISO_DATE_FORMAT);
  }

  if (fieldName === FORM_FIELDS.DATE_OF_SPONSORSHIP){
    return declaration.dateOfEvent && moment(declaration.dateOfEvent).format(DEFAULT_ISO_DATE_FORMAT);
  }

  if(sponsorshipDetails){
    // console.log("derbana")
    // console.log(sponsorshipDetails)
    if (fieldName === FORM_FIELDS.SPONSORSHIP_ADDRESS){
      return sponsorshipDetails.sponsorshipAddress
    }
    
    if (fieldName === "sponsorshipTitle"){
      // console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ")
      // console.log(sponsorshipDetails.sponsorshipTitle)
      return sponsorshipDetails.sponsorshipTitle
    }
    if (fieldName === FORM_FIELDS.SPONSORSHIP_FIRSTNAME){
      return sponsorshipDetails.sponsorshipFirstName
    }
    if (fieldName === FORM_FIELDS.SPONSORSHIP_LASTNAME){
      return sponsorshipDetails.sponsorshipLastName
    }
    if (fieldName === FORM_FIELDS.SPONSORSHIP_COMPANY_NAME){
      return sponsorshipDetails.sponsorshipCompanyName
    }
    if (fieldName === FORM_FIELDS.SPONSORSHIP_ZIPCODE){
      return sponsorshipDetails.sponsorshipZipCode
    }
    if (fieldName === FORM_FIELDS.SPONSORSHIP_EMAIL){
      return sponsorshipDetails.sponsorshipEmail
    }
    if (fieldName === FORM_FIELDS.SPONSORSHIP_CITY){
      return sponsorshipDetails.sponsorshipCity
    }
    if (fieldName === FORM_FIELDS.SPONSORSHIP_PHONE_NUMBER){
      return sponsorshipDetails.sponsorshipPhoneNumber
    }
    if (fieldName === FORM_FIELDS.CONTACT_AGREEMENT){
      if(sponsorshipDetails.contactAgreement){
        return formatMessage({id:"response.yes"})
      }
      if(!sponsorshipDetails.contactAgreement){
        return formatMessage({id:"response.no"})
      }
    }

    
  }


  return declaration[fieldName];
};

// export const prepareDeclarationData = (values, beneficiaryData,programData) => {
//   console.log("dkhell")
//   if(programData == PROGRAM_TYPES[CHALLENGE] && programData.goals[0].measurementName ===){

//   }
//   let dateOfEvent = values[FORM_FIELDS.DATE_OF_EVENT];
//   if (values[FORM_FIELDS.TIME_OF_SALE]) {
//     dateOfEvent = createDeclarationDateOfEvent(values[FORM_FIELDS.DATE_OF_EVENT], values[FORM_FIELDS.TIME_OF_SALE]);
//   }
//   const amount = values[FORM_FIELDS.AMOUNT] && Number(values[FORM_FIELDS.AMOUNT].replace(',', '.'));
//   const quantity = Number(values[FORM_FIELDS.QUANTITY].replace(',', '.'));
//   const productData = values[FORM_FIELDS.PRODUCT_NAME];

//   return {
//     ...values,
//     ...beneficiaryData,
//     ...productData,
//     [FORM_FIELDS.PRODUCT_NAME]: undefined,
//     amount,
//     quantity,
//     dateOfEvent
//   };
// };


export const prepareDeclarationData = (values, beneficiaryData,programData) => {
  // console.log("dans fonction bug :")
  // console.log(programData.type)
  // console.log(programData.cube.goals[0].measurementName)
  console.log("hado values :")
  console.log(values)

  if(programData.type == PROGRAM_TYPES[CHALLENGE] || programData.type == PROGRAM_TYPES[LOYALTY]){
    console.log("dkhell action challenge")
    let dateOfEvent = values[FORM_FIELDS.DATE_OF_EVENT];
    if (values[FORM_FIELDS.TIME_OF_SALE]) {
      dateOfEvent = createDeclarationDateOfEvent(values[FORM_FIELDS.DATE_OF_EVENT], values[FORM_FIELDS.TIME_OF_SALE]);
    }
    const amount = values[FORM_FIELDS.AMOUNT] && Number(values[FORM_FIELDS.AMOUNT].replace(',', '.'));
    const quantity = Number(values[FORM_FIELDS.QUANTITY].replace(',', '.'));
    const productData = values[FORM_FIELDS.PRODUCT_NAME];
  
    return {
      ...values,
      ...beneficiaryData,
      ...productData,
      [FORM_FIELDS.PRODUCT_NAME]: undefined,
      amount,
      quantity,
      dateOfEvent
    };
  }
  else{
    console.log("dkhell volume or CA challenge")
    if(programData.type == PROGRAM_TYPES[CHALLENGE]){
      let dateOfEvent = values[FORM_FIELDS.DATE_OF_EVENT];
    if (values[FORM_FIELDS.TIME_OF_SALE]) {
      dateOfEvent = createDeclarationDateOfEvent(values[FORM_FIELDS.DATE_OF_EVENT], values[FORM_FIELDS.TIME_OF_SALE]);
    }
    const amount = 0;
    const quantity = Number(values[FORM_FIELDS.QUANTITY].replace(',', '.'));
    const productData = values[FORM_FIELDS.PRODUCT_NAME];
  
    return {
      ...values,
      ...beneficiaryData,
      ...productData,
      [FORM_FIELDS.PRODUCT_NAME]: undefined,
      amount,
      quantity,
      dateOfEvent
    };
    }

    if(programData.type == PROGRAM_TYPES[SPONSORSHIP]){
      if (programData.type == PROGRAM_TYPES[SPONSORSHIP]) {
        console.log("Entering sponsorship logic");
    
        let dateOfEvent = values[FORM_FIELDS.DATE_OF_SPONSORSHIP];
        // if (values[FORM_FIELDS.TIME_OF_SALE]) {
        //     dateOfEvent = createDeclarationDateOfEvent(values[FORM_FIELDS.DATE_OF_EVENT], values[FORM_FIELDS.TIME_OF_SALE]);
        // }
        
        const productData = values[FORM_FIELDS.PRODUCT_NAME];
        const sponsorshipDetails = {
            companyName: values[FORM_FIELDS.COMPANY_NAME],
            civility: values[FORM_FIELDS.SPONSORSHIP_TITLE],
            customerLastName: values[FORM_FIELDS.SPONSORSHIP_LASTNAME],
            customerFirstName: values[FORM_FIELDS.SPONSORSHIP_FIRSTNAME],
            address: values[FORM_FIELDS.SPONSORSHIP_ADDRESS],
            zipCode: values[FORM_FIELDS.SPONSORSHIP_ZIPCODE],
            city: values[FORM_FIELDS.SPONSORSHIP_CITY],
            phoneNumber: values[FORM_FIELDS.SPONSORSHIP_PHONE_NUMBER],
            email: values[FORM_FIELDS.SPONSORSHIP_EMAIL],
            title : values[FORM_FIELDS.SPONSORSHIP_CIVILITY],
            proofOfFile: values[FORM_FIELDS.PROOF_OF_SALE],
            accessAgreement : !!values[FORM_FIELDS.CONTACT_AGREEMENT]
            
        };
        const quantity = 1
        const amount = 1

    
        return {
            ...values,
            ...beneficiaryData,
            ...productData,
            ...sponsorshipDetails,
            [FORM_FIELDS.PRODUCT_NAME]: undefined,
            amount,
            quantity,
            dateOfEvent
        };
    }
    }
  }
  
  
};

/**
 * Merges declaration date and time fields into a single field
 * @param dateOfEvent
 * @param timeOfSale
 */
const createDeclarationDateOfEvent = (dateOfEvent, timeOfSale) => {
  if (!dateOfEvent) {
    return timeOfSale;
  }

  dateOfEvent.setHours(timeOfSale.getHours());
  dateOfEvent.setMinutes(timeOfSale.getMinutes());

  return dateOfEvent;
};

/**
 * Return whether given source type points to a individually created user declaration.
 * @param sourceType
 */
export const isIndividualDeclaration = (sourceType: USER_DECLARATION_SOURCE): boolean =>
  USER_DECLARATION_SOURCE.FORM === sourceType;

/**
 * Return whether given source type points to a file upload user declaration.
 * @param sourceType
 */
export const isDeclarationUpload = (sourceType: USER_DECLARATION_SOURCE): boolean =>
  USER_DECLARATION_SOURCE.FILE_UPLOAD === sourceType;

/**
 * Validates a declaration file (size and format).
 * @param file
 */
export const validateDeclarationFile = (file: File): { isValid: boolean; error?: number } => {
  if (!file) {
    return { isValid: true };
  }

  if (!hasExtension(file, ACCEPTED_DECLARATION_UPLOAD_TYPES)) {
    return {
      isValid: false,
      error: UPLOAD_DECLARATIONS_ERROR_CODES.UPLOAD_FILE_INVALID_TYPE
    };
  }

  if (convertBytesToMb(file.size) > ACCEPTED_DECLARATION_UPLOAD_MB_SIZE) {
    return { isValid: false, error: UPLOAD_DECLARATIONS_ERROR_CODES.UPLOAD_FILE_LARGE };
  }

  return { isValid: true };
};

export const getAcceptedDeclarationFileTypesAndSize = () => ({
  accept: ACCEPTED_DECLARATION_UPLOAD_TYPES.map(ext => `.${ext}`),
  maxSize: convertMbToBytes(ACCEPTED_DECLARATION_UPLOAD_MB_SIZE)
});
