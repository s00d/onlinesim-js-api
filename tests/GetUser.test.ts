import {GetUser} from "../src/Apis/GetUser";
import _base from "../src/Apis/_base";

jest.mock('../src/Apis/_base');

describe('GetUser', () => {
  let getUser: GetUser;

  beforeEach(() => {
    getUser = new GetUser('apiToken', 'en', 123);
    (_base as any).mockClear();
  });

  it('should call balance with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ balance: 100, zbalance: 50, income: 150 });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getUser.balance();

    expect(mockGetRequest).toHaveBeenCalledWith('getBalance', { income: true });
    expect(result).toEqual({ balance: 100, zbalance: 50, income: 150 });
  });

  it('should call profile with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ profile: { id: 1, name: 'John Doe', username: 'johndoe' } });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getUser.profile();

    expect(mockGetRequest).toHaveBeenCalledWith('getProfile', { income: true });
    expect(result).toEqual({ id: 1, name: 'John Doe', username: 'johndoe' });
  });

  it('should call getPaymentHistory with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ orders: { current_page: 1 }, paylist: {} });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getUser.getPaymentHistory();

    expect(mockGetRequest).toHaveBeenCalledWith('getPaymentHistory');
    expect(result).toEqual({ orders: { current_page: 1 }, paylist: {} });
  });

  it('should call createEmpty with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ payId: 1, params: { url: 'http://example.com' } });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const params = { sum: '100', comment: 'Test payment' };
    const result = await getUser.createEmpty(params);

    expect(mockGetRequest).toHaveBeenCalledWith('pay/createEmpty', params, false);
    expect(result).toEqual({ payId: 1, params: { url: 'http://example.com' } });
  });
});
