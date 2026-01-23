import { processTranslations } from '../../services/SectionsServices';
import { messagesMock, proessedMessagesMock } from '../../__mocks__/howItWorksMocks';

describe('whyChooseUs function test', () => {
  test('check if whyChooseUs sections are equal to messages mocks and are greater than 1', () => {
    const processedMessages = processTranslations(messagesMock, 'howItWorks.', '.info');

    expect(processedMessages).toStrictEqual(proessedMessagesMock);
    expect(processedMessages.length).toBeGreaterThan(1);
  });
});
