import { FREQUENCY_PRICING_PLAN } from '__mocks__/pricingMocks';
import { getInitialSlide, processTranslations } from 'services/PaymentServices';
import { messagesMock, proessedMessagesMock } from '__mocks__/paymentMocks';

describe('sectionServices function test', () => {
  test('check if paymentMocks are equal to messages mocks and are greater than 1', () => {
    const processedMessages = processTranslations(messagesMock, 'paymentMethod.type.');

    expect(processedMessages).toStrictEqual(proessedMessagesMock);
    expect(processedMessages.length).toBeGreaterThan(1);
  });
});

describe('getInitialSlide function test', () => {
  test('should return the correct index', () => {
    const mockInitialSlide = getInitialSlide([FREQUENCY_PRICING_PLAN]);

    expect(mockInitialSlide).toBe(0);
  });
});
