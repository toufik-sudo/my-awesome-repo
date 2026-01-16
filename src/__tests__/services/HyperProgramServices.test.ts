import {
  getRolesArrayFromPrograms,
  isValidPlatformName,
  isSuperPlatform,
  isHyperPlatform,
  isIndependentPlatform,
  findPlatformById
} from 'services/HyperProgramService';

describe('Method used to get unique roles from program arrays', () => {
  test('if the function returns an array', () => {
    const uniqueArrayRoles = getRolesArrayFromPrograms;
    expect(uniqueArrayRoles).toBeDefined();
  });
});

describe('Method used to verify if name is valid for use', () => {
  test('if the function returns true or false if the name is valid or not', () => {
    const platformNameValid = isValidPlatformName('salam');
    expect(platformNameValid).toBe(true);

    const platformNameInvalid = isValidPlatformName('');
    expect(platformNameInvalid).toBe(false);
  });
});

describe('Checks whether given hierarchicType corresponds to a super-platform', () => {
  test('if the function returns true or false depends if it is super-platform or not', () => {
    const superPlatform1 = isSuperPlatform(1);
    expect(superPlatform1).toBe(false);

    const superPlatform2 = isSuperPlatform(2);
    expect(superPlatform2).toBe(false);

    const superPlatform3 = isSuperPlatform(3);
    expect(superPlatform3).toBe(true);

    const superPlatform4 = isSuperPlatform(4);
    expect(superPlatform4).toBe(false);
  });
});

describe('Checks whether given hierarchicType corresponds to a independent-platform', () => {
  test('if the function returns true or false depends if it is independent-platform or not', () => {
    const independentPlatform1 = isIndependentPlatform(1);
    expect(independentPlatform1).toBe(true);

    const independentPlatform2 = isIndependentPlatform(2);
    expect(independentPlatform2).toBe(false);

    const independentPlatform3 = isIndependentPlatform(3);
    expect(independentPlatform3).toBe(false);

    const independentPlatform4 = isIndependentPlatform(4);
    expect(independentPlatform4).toBe(false);
  });
});

describe('Checks whether given hierarchicType corresponds to a hyper-platform', () => {
  test('if the function returns true or false depends if it is hyper-platform or not', () => {
    const hyperPlatform1 = isHyperPlatform(1);
    expect(hyperPlatform1).toBe(false);

    const hyperPlatform2 = isHyperPlatform(2);
    expect(hyperPlatform2).toBe(false);

    const hyperPlatform3 = isHyperPlatform(3);
    expect(hyperPlatform3).toBe(false);

    const hyperPlatform4 = isHyperPlatform(4);
    expect(hyperPlatform4).toBe(true);
  });
});

describe('Find if the platform with given Id corresponds to a value from array', () => {
  test('if the function return an empty array', () => {
    const foundPlatform = findPlatformById([], 2);
    expect(foundPlatform).toStrictEqual({});
  });
});
