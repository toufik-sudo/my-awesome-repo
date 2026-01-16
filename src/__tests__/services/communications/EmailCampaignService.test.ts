import {
  validateCreateEmailCampaign,
  getCreateEmailTemplatePayload,
  buildUploadableImages,
  getCampaignFilterOptions
} from 'services/communications/EmailCampaignService';
import {
  mockLogoEmptyDescription,
  mockLogoDescription,
  mockImageDescription,
  mockImage,
  mockImages,
  mockImagesResponse
} from '__mocks__/emailCampaignServiceMocks';

describe(' This function maps the given fields when is about to create an email campaign', () => {
  test('test if it can create the email template', () => {
    const functionResponse = getCreateEmailTemplatePayload(
      10,
      'Mock Campaign',
      mockLogoDescription,
      mockImageDescription,
      mockImage
    );
    expect(functionResponse).toBeDefined();
  });
});

describe(' This function validates all the given fields when is about to create an email campaign', () => {
  test('test if the email is invalid', () => {
    const validationResponse = validateCreateEmailCampaign(
      'a',
      mockImageDescription,
      mockLogoEmptyDescription,
      10,
      10,
      () => {}
    );
    expect(validationResponse).toBe(false);
  });

  test('test if the email is valid', () => {
    const validationResponse = validateCreateEmailCampaign(
      'Mock valid campaign',
      mockImageDescription,
      mockLogoDescription,
      1,
      1,
      () => {}
    );
    expect(validationResponse).toBe(true);
  });

  test('test if the email is valid', () => {
    const validationResponse = validateCreateEmailCampaign(
      'Mock invalid campaign',
      mockLogoEmptyDescription,
      mockLogoEmptyDescription,
      3,
      3,
      () => {}
    );
    expect(validationResponse).toBe(false);
  });
});

describe('This function maps valid images to the required format for uploading them', () => {
  test('if the function works', () => {
    const imagesArray = buildUploadableImages(mockImages, 4);
    expect(imagesArray).toEqual(mockImagesResponse);
  });
});

describe('This function return the options that need to be shown in status drop menu', () => {
  test('if the function return campaign filters options', () => {
    expect(getCampaignFilterOptions).toBeDefined();
  });
});
