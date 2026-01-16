import { mockLabels, mockAdminOptions, mockCommunityManagerOptions } from '__mocks__/postServicesMocks';
import { ROLE } from 'constants/security/access';
import { getConfidentialityOnlyOptions, getPostEditOptions, validatePostCreation } from 'services/posts/postsServices';

describe('Function returns the options needed for confidentiality selection', () => {
  test('If the function returns the correct response', () => {
    expect(getConfidentialityOnlyOptions()).toStrictEqual(mockLabels);
  });
});

describe('Function retrieves the operations allowed for the specific role', () => {
  test('If the function returns the correct response according to specified role', () => {
    expect(getPostEditOptions(ROLE.BENEFICIARY)).toStrictEqual([]);
  });

  test('If the function returns the correct response according to specified role', () => {
    expect(getPostEditOptions(ROLE.ADMIN)).toStrictEqual(mockAdminOptions);
  });

  test('If the function returns the correct response according to specified role', () => {
    expect(getPostEditOptions(ROLE.HYPER_ADMIN)).toStrictEqual(mockAdminOptions);
  });

  test('If the function returns the correct response according to specified role', () => {
    expect(getPostEditOptions(ROLE.HYPER_COMMUNITY_MANAGER)).toStrictEqual(mockCommunityManagerOptions);
  });

  test('If the function returns the correct response according to specified role', () => {
    expect(getPostEditOptions(ROLE.SUPER_ADMIN)).toStrictEqual(mockAdminOptions);
  });

  test('If the function returns the correct response according to specified role', () => {
    expect(getPostEditOptions(ROLE.SUPER_COMMUNITY_MANAGER)).toStrictEqual(mockCommunityManagerOptions);
  });

  test('If the function returns the correct response according to specified role', () => {
    expect(getPostEditOptions(ROLE.TEAM_MANAGER)).toStrictEqual(mockCommunityManagerOptions);
  });
});

describe('This function is used to validate post data', () => {
  test('If the function validate or not the information', () => {
    const responseValid = validatePostCreation(
      'Mock Title',
      'Mock Content',
      () => {},
      () => {},
      () => {}
    );
    expect(responseValid).toBeUndefined();
  });
});
