import {GetFree} from '../src/Apis/GetFree';
import _base from '../src/Apis/_base';

jest.mock('../src/Apis/_base');

describe('GetFree', () => {
  let getFree: GetFree;

  beforeEach(() => {
    getFree = new GetFree('apiToken', 'en', 123);
    (_base as any).mockClear();
  });

  it('should call countries with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ countries: [{ country: 1, country_text: 'USA' }] });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getFree.countries();

    expect(mockGetRequest).toHaveBeenCalledWith('getFreeCountryList', {});
    expect(result).toEqual([{ country: 1, country_text: 'USA' }]);
  });

  it('should call numbers with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ numbers: [{ maxdate: '2023-01-01', number: '1234567890', country: 1 }] });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getFree.numbers(1);

    expect(mockGetRequest).toHaveBeenCalledWith('getFreePhoneList', { country: 1 });
    expect(result).toEqual([{ maxdate: '2023-01-01', number: '1234567890', country: 1 }]);
  });

  it('should call messages with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ messages: { data: [{ text: 'Hello', in_number: '1234567890', my_number: 1 }] } });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getFree.messages(1234567890, 1);

    expect(mockGetRequest).toHaveBeenCalledWith('getFreeMessageList', { phone: 1234567890, page: 1 });
    expect(result).toEqual([{ text: 'Hello', in_number: '1234567890', my_number: 1 }]);
  });

  it('should call getFreeList with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({
      countries: [{ country: 1, country_text: 'USA' }],
      numbers: [{ maxdate: '2023-01-01', number: '1234567890', country: 1 }],
      messages: [{ text: 'Hello', in_number: '1234567890', my_number: 1 }]
    });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getFree.freeList();

    expect(mockGetRequest).toHaveBeenCalledWith('getFreeList', {});
    expect(result).toEqual({
      countries: [{ country: 1, country_text: 'USA' }],
      numbers: [{ maxdate: '2023-01-01', number: '1234567890', country: 1 }],
      messages: [{ text: 'Hello', in_number: '1234567890', my_number: 1 }]
    });
  });
});
