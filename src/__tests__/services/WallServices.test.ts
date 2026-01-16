import { MOCK_DATE } from '__mocks__/formMocks';
import { getDMYDateFormat, getHMHourFormat, resolveMediaType } from 'services/WallServices';
import { POST_FILE_TYPE, COMMENT_FILE_TYPE } from 'constants/api';
import { IMAGE, VIDEO, FILE } from 'constants/files';

describe('test getDMYDateFormat service function', () => {
  test('passing an string value containing date should return corresponding dd/mm/yy value', () => {
    expect(getDMYDateFormat(MOCK_DATE)).toBe('24/12/2018');
  });
});

describe('test getHMHourFormat service function', () => {
  test('passing an string value containing date should return corresponding hh:mm value', () => {
    expect(getHMHourFormat(MOCK_DATE)).toHaveLength(5);
  });
});

describe('test resolveMediaType service function', () => {
  test('passing a post/comment image file type should resolve media type as image', () => {
    expect(resolveMediaType(POST_FILE_TYPE.POST_IMAGE)).toEqual(IMAGE);
    expect(resolveMediaType(COMMENT_FILE_TYPE.COMMENT_IMAGE)).toEqual(IMAGE);
  });

  test('passing a post/comment video file type should resolve media type as video', () => {
    expect(resolveMediaType(POST_FILE_TYPE.POST_VIDEO)).toEqual(VIDEO);
    expect(resolveMediaType(COMMENT_FILE_TYPE.COMMENT_VIDEO)).toEqual(VIDEO);
  });

  test('passing a post/comment video file type should resolve media type as file', () => {
    expect(resolveMediaType(POST_FILE_TYPE.POST_OTHERS)).toEqual(FILE);
    expect(resolveMediaType(COMMENT_FILE_TYPE.COMMENT_OTHERS)).toEqual(FILE);
  });
});
