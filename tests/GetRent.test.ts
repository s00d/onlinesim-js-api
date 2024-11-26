import {GetRent} from "../src/Apis/GetRent";
import _base from "../src/Apis/_base";

jest.mock('../src/Apis/_base');

describe('GetRent', () => {
  let getRent: GetRent;

  beforeEach(() => {
    getRent = new GetRent('apiToken', 'en', 123);
    (_base as any).mockClear();
  });

  it('should call get with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ item: { tzid: 1, status: 1 } });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getRent.get(7, 1, false);

    expect(mockGetRequest).toHaveBeenCalledWith('rent/getRentNum', { country: 7, days: 1, extension: false, pagination: false });
    expect(result).toEqual({ tzid: 1, status: 1 });
  });

  it('should call state with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ list: [{ tzid: 1, status: 1 }] });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getRent.state();

    expect(mockGetRequest).toHaveBeenCalledWith('rent/getRentState', { pagination: false });
    expect(result).toEqual([{ tzid: 1, status: 1 }]);
  });

  it('should call stateOne with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ list: [{ tzid: 1, status: 1 }] });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getRent.stateOne(1);

    expect(mockGetRequest).toHaveBeenCalledWith('rent/getRentState', { tzid: 1, pagination: false });
    expect(result).toEqual({ tzid: 1, status: 1 });
  });

  it('should call extend with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ item: { tzid: 1, status: 1 } });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getRent.extend(1, 1);

    expect(mockGetRequest).toHaveBeenCalledWith('rent/extendRentState', { tzid: 1, days: 1 });
    expect(result).toEqual({ tzid: 1, status: 1 });
  });

  it('should call portReload with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({});
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getRent.portReload(1);

    expect(mockGetRequest).toHaveBeenCalledWith('rent/portReload', { tzid: 1 });
    expect(result).toEqual(true);
  });

  it('should call tariffs with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ code1: { name: 'USA', code: 1 } });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getRent.tariffs();

    expect(mockGetRequest).toHaveBeenCalledWith('rent/tariffsRent');
    expect(result).toEqual({ code1: { name: 'USA', code: 1 } });
  });

  it('should call tariffsOne with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ name: 'USA', code: 1 });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getRent.tariffsOne(1);

    expect(mockGetRequest).toHaveBeenCalledWith('rent/tariffsRent', { country: 1 });
    expect(result).toEqual({ name: 'USA', code: 1 });
  });

  it('should call close with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({});
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getRent.close(1);

    expect(mockGetRequest).toHaveBeenCalledWith('rent/closeRentNum', { tzid: 1 });
    expect(result).toEqual(true);
  });
});
