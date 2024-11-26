import {GetOnlineProxy} from '../src/Apis/GetOnlineProxy';
import _base from '../src/Apis/_base';

jest.mock('../src/Apis/_base');

describe('GetOnlineProxy', () => {
  let getOnlineProxy: GetOnlineProxy;

  beforeEach(() => {
    getOnlineProxy = new GetOnlineProxy('apiToken', 'en', 123);
    (_base as any).mockClear();
  });

  it('should call getProxy with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ id: '1', ip: '127.0.0.1', port: 8080 });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getOnlineProxy.getProxy('1');

    expect(mockGetRequest).toHaveBeenCalledWith('proxies/1', {}, false);
    expect(result).toEqual({ id: '1', ip: '127.0.0.1', port: 8080 });
  });

  it('should call getProxyList with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ proxies: [{ id: '1', ip: '127.0.0.1', port: 8080 }] });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getOnlineProxy.getProxyList();

    expect(mockGetRequest).toHaveBeenCalledWith('proxies', {}, false);
    expect(result).toEqual({ proxies: [{ id: '1', ip: '127.0.0.1', port: 8080 }] });
  });

  it('should call rotateProxy with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ success: true, newIp: '127.0.0.2' });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getOnlineProxy.rotateProxy();

    expect(mockGetRequest).toHaveBeenCalledWith('rotate', {}, false);
    expect(result).toEqual({ success: true, newIp: '127.0.0.2' });
  });

  it('should call createOrUpdateProxyComment with correct parameters', async () => {
    const mockPostRequest = jest.fn().mockResolvedValue({ success: true, message: 'Comment updated' });
    (_base.prototype.postRequest as any).mockImplementation(mockPostRequest);

    const result = await getOnlineProxy.createOrUpdateProxyComment('1', 'New comment');

    expect(mockPostRequest).toHaveBeenCalledWith('proxies/1/comment', { comment: 'New comment' });
    expect(result).toEqual({ success: true, message: 'Comment updated' });
  });

  it('should call getAvailableProxiesForOrder with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ proxies: [{ id: '1', ip: '127.0.0.1', port: 8080 }] });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getOnlineProxy.getAvailableProxiesForOrder();

    expect(mockGetRequest).toHaveBeenCalledWith('filters', {}, false);
    expect(result).toEqual({ proxies: [{ id: '1', ip: '127.0.0.1', port: 8080 }] });
  });

  it('should call orderProxy with correct parameters', async () => {
    const mockPostRequest = jest.fn().mockResolvedValue({ success: true, orderId: 'order123' });
    (_base.prototype.postRequest as any).mockImplementation(mockPostRequest);

    const orderData = { proxyId: '1', quantity: 1 };
    const result = await getOnlineProxy.orderProxy(orderData);

    expect(mockPostRequest).toHaveBeenCalledWith('order', orderData);
    expect(result).toEqual({ success: true, orderId: 'order123' });
  });

  it('should call getProxyTariffs with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ tariffs: [{ period: '1 month', price: 10 }] });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getOnlineProxy.getProxyTariffs();

    expect(mockGetRequest).toHaveBeenCalledWith('tariffs', {}, false);
    expect(result).toEqual({ tariffs: [{ period: '1 month', price: 10 }] });
  });

  it('should call getUserBalance with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ balance: 100 });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getOnlineProxy.getUserBalance();

    expect(mockGetRequest).toHaveBeenCalledWith('balance', {}, false);
    expect(result).toEqual({ balance: 100 });
  });
});
