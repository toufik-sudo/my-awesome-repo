export interface IProgram {
  id: number;
  name: string;
}

export interface ICreatedBy {
  firstName: string;
  lastName: string;
  originalPicture: string;
  croppedPicture: string;
}

export interface IEmailCampaign {
  id: number;
  program: IProgram;
  name: string;
  subject: string;
  emailsSent: number;
  emailUserListId: number;
  emailTemplateId: number;
  status: number;
  createdAt: string;
  updatedAt?: string;
  createdBy: ICreatedBy;
}
export interface IEmailUsersList {
  id: number;
  name: string;
  program: IProgram;
  total: number;
  createdAt: string;
}
