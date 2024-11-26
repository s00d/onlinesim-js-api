import {GetProxy} from '../src/Apis/GetProxy';
import _base from '../src/Apis/_base';

jest.mock('../src/Apis/_base');

describe('GetProxy', () => {
  let getProxy: GetProxy;

  beforeEach(() => {
    getProxy = new GetProxy('apiToken', 'en', 123);
    (_base as any).mockClear();
  });

  it('should call tariffs with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ days: {}, traffic: {} });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getProxy.tariffs();

    expect(mockGetRequest).toHaveBeenCalledWith('proxy/tariffs', {});
    expect(result).toEqual({ days: {}, traffic: {} });
  });

  it('should call get with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ item: { type: 'private', host: 'example.com' } });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getProxy.get('days', 'private', 'https', 1, 'mts', 'any', 'any', 1, true);

    expect(mockGetRequest).toHaveBeenCalledWith('proxy/getProxy', { class: 'days', type: 'private', connect: 'https', count: 1, operator: 'mts', country: 'any', city: 'any', port_count: 1, session: true });
    expect(result).toEqual({ type: 'private', host: 'example.com' });
  });

  it('should call state with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ list: [{ tzid: 1, type: 'private' }] });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getProxy.state('ASC');

    expect(mockGetRequest).toHaveBeenCalledWith('proxy/getState', { orderby: 'ASC' });
    expect(result).toEqual([{ tzid: 1, type: 'private' }]);
  });

  it('should call stateOne with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ list: [{ tzid: 1, type: 'private' }] });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getProxy.stateOne(1);

    expect(mockGetRequest).toHaveBeenCalledWith('proxy/getState', { tzid: 1 });
    expect(result).toEqual({ tzid: 1, type: 'private' });
  });

  it('should call changeIp with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({});
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getProxy.changeIp(1);

    expect(mockGetRequest).toHaveBeenCalledWith('proxy/changeIp', { tzid: 1 });
    expect(result).toEqual(true);
  });

  it('should call changeType with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({ connect_type: 'socks' });
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getProxy.changeType(1);

    expect(mockGetRequest).toHaveBeenCalledWith('proxy/changeType', { tzid: 1 });
    expect(result).toEqual('socks');
  });

  it('should call setComment with correct parameters', async () => {
    const mockGetRequest = jest.fn().mockResolvedValue({});
    (_base.prototype.getRequest as any).mockImplementation(mockGetRequest);

    const result = await getProxy.setComment(1, 'new comment');

    expect(mockGetRequest).toHaveBeenCalledWith('proxy/setComment', { tzid: 1, comment: 'new comment' });
    expect(result).toEqual(true);
  });
});
