import { setWindowResize } from 'services/VideoServices';

describe('resize the window for video', () => {
  test('if the video has been resized', () => {
    const functionResponse = setWindowResize(() => {}, 500);
    expect(functionResponse).toBeTruthy;
  });
});
