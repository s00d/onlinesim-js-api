import {GetNumbers} from "../src/Apis/GetNumbers";
import _base from "../src/Apis/_base";

jest.mock('../src/Apis/_base');

describe('GetNumbers', () => {
  let getNumbers: GetNumbers;

  beforeEach(() => {
    getNumbers = new GetNumbers('apiToken', 'en', 123);
    (_base as any).mockClear();
  });

  it('should call price with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ price: '10' });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.price('service1', 7);

    expect(mockGetRequest).toHaveBeenCalledWith('getPrice', { service: 'service1', country: 7 });
    expect(result).toEqual('10');
  });

  it('should call get with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ tzid: 123 });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.get('service1', 7, [1, 2], true);

    expect(mockGetRequest).toHaveBeenCalledWith('getNum', { service: 'service1', country: 7, reject: [1, 2], extension: true });
    expect(result).toEqual(123);
  });

  it('should call getWithNumber with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ tzid: 123, number: '1234567890' });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.getWithNumber('service1', 7, [1, 2], true);

    expect(mockGetRequest).toHaveBeenCalledWith('getNum', { service: 'service1', country: 7, reject: [1, 2], extension: true, number: true });
    expect(result).toEqual({ tzid: 123, number: '1234567890', country: 7 });
  });

  it('should call state with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue([{ tzid: 1, response: 'ok' }]);
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.state(1, 'ASC', true, true, false);

    expect(mockGetRequest).toHaveBeenCalledWith('getState', { message_to_code: 1, orderby: 'ASC', msg_list: 1, clean: 1, type: 'index' });
    expect(result).toEqual([{ tzid: 1, response: 'ok' }]);
  });

  it('should call stateOne with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue([{ tzid: 1, response: 'ok' }]);
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.stateOne(1, 1, true, true, false);

    expect(mockGetRequest).toHaveBeenCalledWith('getState', { tzid: 1, message_to_code: 1, msg_list: true, clean: true, repeat: false });
    expect(result).toEqual({ tzid: 1, response: 'ok' });
  });

  it('should call next with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({});
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.next(123);

    expect(mockGetRequest).toHaveBeenCalledWith('setOperationRevise', { tzid: 123 });
    expect(result).toEqual(true);
  });

  it('should call close with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({});
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.close(123);

    expect(mockGetRequest).toHaveBeenCalledWith('setOperationOk', { tzid: 123 });
    expect(result).toEqual(true);
  });

  it('should call ban with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({});
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.ban(123);

    expect(mockGetRequest).toHaveBeenCalledWith('setOperationOk', { tzid: 123, ban: 1 });
    expect(result).toEqual(true);
  });

  it('should call repeat with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ tzid: 123 });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.repeat('service1', 1234567890);

    expect(mockGetRequest).toHaveBeenCalledWith('getNumRepeat', { service: 'service1', number: 1234567890 });
    expect(result).toEqual(123);
  });

  it('should call tariffs with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ country1: { name: 'USA', code: 1 } });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.tariffs();

    expect(mockGetRequest).toHaveBeenCalledWith('getNumbersStats', { country: 'all' });
    expect(result).toEqual({ country1: { name: 'USA', code: 1 } });
  });

  it('should call tariffsOne with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ name: 'USA', code: 1 });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.tariffsOne(1);

    expect(mockGetRequest).toHaveBeenCalledWith('getNumbersStats', { country: 1 });
    expect(result).toEqual({ name: 'USA', code: 1 });
  });

  it('should call service with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ service: ['service1', 'service2'] });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.service();

    expect(mockGetRequest).toHaveBeenCalledWith('getService', {});
    expect(result).toEqual(['service1', 'service2']);
  });

  it('should call serviceNumber with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ number: ['1234567890', '0987654321'] });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getNumbers.serviceNumber('service1');

    expect(mockGetRequest).toHaveBeenCalledWith('getServiceNumber', { service: 'service1' });
    expect(result).toEqual(['1234567890', '0987654321']);
  });
});
