import { byteConverter } from 'services/ConverterService';
import { converterMockValues } from '__mocks__/converterMocks';

describe('convert bytes to bigger units function test', () => {
  test('should return bytes converted to a bigger unit (KB, MB, GB, TB, PB, EB, ZB, YB) depends on how many bytes is the size of the chosen photo', () => {
    expect(byteConverter(converterMockValues.bytesToBytes)).toBe('123 bytes');
    expect(byteConverter(converterMockValues.bytesToKB)).toBe('4.0 KB');
    expect(byteConverter(converterMockValues.bytesToMB)).toBe('16 MB');
    expect(byteConverter(converterMockValues.bytesToGB)).toBe('64 GB');
    expect(byteConverter(converterMockValues.bytesToTB)).toBe('1.0 TB');
    expect(byteConverter(converterMockValues.bytesToPB)).toBe('1.0 PB');
    expect(byteConverter(converterMockValues.bytesToEB)).toBe('1.0 EB');
    expect(byteConverter(converterMockValues.bytesToZB)).toBe('1 bytes');
    expect(byteConverter(converterMockValues.bytesToYB)).toBe('1 bytes');
  });
});
