import { processTranslations } from '../../services/SectionsServices';
import { messagesMock, proessedMessagesMock } from '../../__mocks__/serviceMocks';

describe('sectionServices function test', () => {
  test('check if servicesMocks are equal to messages mocks and are greater than 1', () => {
    const processedMessages = processTranslations(messagesMock, 'whyChooseUs.', '.info');

    expect(processedMessages).toStrictEqual(proessedMessagesMock);
    expect(processedMessages.length).toBeGreaterThan(1);
  });
});
