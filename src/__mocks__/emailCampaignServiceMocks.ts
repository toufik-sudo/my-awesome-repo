import { EditorState, ContentState } from 'draft-js';

export const mockLogoEmptyDescription = EditorState.createEmpty();
export const mockLogoDescription = EditorState.createWithContent(ContentState.createFromText('Logo mock description'));
export const mockImage = 'https://cdn.webnoviny.sk/2018/07/bruce-willis-sita-ap-3-225x225.jpg';
export const mockImage1 = import('../assets/images/mocks/mockPhoto1.jpg');
export const mockImage2 = import('../assets/images/mocks/mockPhoto2.jpg');

export const mockImageDescription = EditorState.createWithContent(
  ContentState.createFromText('Image mock description')
);

export const mockImages = [mockImage, mockImage1, mockImage2];

export const mockImagesResponse = [
  {
    file: mockImage,
    filename: undefined,
    type: 4
  },
  {
    file: mockImage1,
    filename: undefined,
    type: 4
  },
  {
    file: mockImage2,
    filename: undefined,
    type: 4
  }
];
