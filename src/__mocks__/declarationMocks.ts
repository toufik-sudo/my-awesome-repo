export const UPLOAD_DECLARATION_ROW_ERRORS_RESPONSE = {
  response: {
    data: {
      fileId: 1,
      totalLines: 1000,
      totalInvalid: 2,
      invalidRecords: [
        {
          rowNumber: 1,
          errors: [
            {
              code: 1002,
              message: 'Missing field',
              field: 'quantity'
            }
          ]
        },
        {
          rowNumber: 10,
          errors: [
            {
              code: 1001,
              message: "Field '*' does not have a valid format or has an unknown value.",
              field: 'amount'
            }
          ]
        }
      ]
    }
  }
};
