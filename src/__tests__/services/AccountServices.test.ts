import { redirectManager, getLoadedClass } from 'services/AccountServices';
import { createMemoryHistory } from 'history';
import { mockImage, mockUserWrapperLoaded } from '__mocks__/accountMocks';

describe('redirect the user based on the last uncompleted step', () => {
  test('if the redirect is made successfully', () => {
    const history = createMemoryHistory();
    redirectManager(history, 1);
    expect(history.length).toBe(2);

    redirectManager(history, 5);
    redirectManager(history, 6);
    expect(history.length).toBe(4);

    redirectManager(history, 3);
    redirectManager(history, 3);
    expect(history.length).toBe(6);
  });
});

describe('the function returns class if the image finished loading', () => {
  test('if returns the image class', () => {
    expect(getLoadedClass(mockImage, mockUserWrapperLoaded)).toBe('cat');
  });
});
