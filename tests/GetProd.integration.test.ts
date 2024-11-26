import {GetNumbers} from "../src/Apis/GetNumbers";
import {GetFree, GetCountriesOne, GetFreeListResponse, GetMessagesOne, GetNumbersOne} from "../src/Apis/GetFree";
import {GetOnlineProxy} from "../src/Apis/GetOnlineProxy";
import _base from "../src/Apis/_base";

describe('GetNumbers Integration Tests', () => {
  let getNumbers: GetNumbers;
  const apiKey = process.env.API_KEY ?? null; // Укажите ваш API ключ

  beforeAll(() => {
    getNumbers = new GetNumbers(apiKey, 'en', 123);
  });

  it('should get countries with sale', async () => {
    const result = await getNumbers.tariffs();

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(Object.keys(result).length).toBeGreaterThan(0);

    for (const countryCode in result) {
      const country = result[countryCode];
      expect(country.name).toBeDefined();
      expect(country.code).toBeDefined();
      expect(country.enabled).toBeDefined();
      expect(country.services).toBeDefined();
    }
  });
});

describe('GetFree Integration Tests', () => {
  let getFree: GetFree;
  const apiKey = process.env.API_KEY ?? null; // Укажите ваш API ключ

  beforeAll(() => {
    getFree = new GetFree(apiKey, 'en', 123);
  });

  it('should get countries', async () => {
    const result = await getFree.countries();

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    result.forEach((country: GetCountriesOne) => {
      expect(country.country).toBeDefined();
      expect(country.country_text).toBeDefined();
    });
  });

  it('should get free list', async () => {
    const result = await getFree.freeList();

    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result.countries).toBeDefined();
    expect(result.numbers).toBeDefined();
    expect(result.messages).toBeDefined();

    result.countries.forEach((country: GetCountriesOne) => {
      expect(country.country).toBeDefined();
      expect(country.country_text).toBeDefined();
    });

    Object.values(result.numbers).forEach((number) => {
      expect(number.full_number).toBeDefined();
      expect(number.country).toBeDefined();
      expect(number.data_humans).toBeDefined();
      expect(number.full_number).toBeDefined();
    });

    result.messages.data.forEach((message: GetMessagesOne) => {
      expect(message.text).toBeDefined();
      expect(message.in_number).toBeDefined();
      expect(message.my_number).toBeDefined();
      expect(message.created_at).toBeDefined();
      expect(message.data_humans).toBeDefined();
    });
  });
});



describe('GetOnlineProxy', () => {
  let getOnlineProxy: GetOnlineProxy;

  beforeEach(() => {
    getOnlineProxy = new GetOnlineProxy('apiToken', 'en', 123);
  });

  // it('should call getProxy with correct parameters', async () => {
  //   const result = await getOnlineProxy.getProxy('1');
  //   console.log(1111, result)
  //   expect(result).toEqual({ id: '1', ip: '127.0.0.1', port: 8080 });
  // });

  it('should call getProxyList with correct parameters', async () => {
    const result = await getOnlineProxy.getProxyList();
    console.log(1111, result)
    expect(result).toEqual({ proxies: [{ id: '1', ip: '127.0.0.1', port: 8080 }] });
  });
});
