export interface IUserDeclaration {
  programId: number;
  dateOfEvent: Date;
  quantity: number;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  customerReference?: string;
  contractReference?: string;
  productReference?: string;
  refereeReference?: string;
  additionalComments?: string;
  productId?: number;
  amount?: number;
  proofOfSale?: File;
}
