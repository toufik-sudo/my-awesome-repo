import { GENERIC_FORM_TYPES } from 'constants/forms';
import { IFormDropdownOption } from 'interfaces/forms/IForm';

export interface IResellerForm {
  lastName: string;
  firstName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  targetedMarkets: string;
  exclusiveMarket: string;
  startDate: Date;
  whyPromote: string;
}

export interface IContactMainForm {
  firstName: string;
  lastName: string;
  email: string;
  incentiveMonthlyBudget: IFormDropdownOption;
  interestedIn: IFormDropdownOption;
  phoneNumber: string;
  websiteUrl: string;
}

export interface ITailoredForm {
  lastName: string;
  firstName: string;
  email: string;
  companyName: string;
  title: string;
  companyRole: string;
  kindOfPrograms: string;
  numberOfPrograms: number;
  numberOfMembers: number;
  connectCrm: string;
  howManyUsers: number;
  useSpecificMarket: string;
  numberOfEmailsPerUser: number;
  useSpecificApplications: string;
  needTraining: string;
  specificUrl: string;
  needsSuperAdmin: string;
  contactDate: Date;
  phoneNumber: string;
}

export interface ICreateAccountForm {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface IFormBase {
  lastName: string;
  firstName: string;
  email: string;
  type: GENERIC_FORM_TYPES;
}

export interface IProcessedResellerForm extends IFormBase {
  data: {
    exclusiveMarket: boolean;
    phoneNumber: string;
    targetedMarkets: string;
    companyName: string;
    startDate: string;
  };
}
