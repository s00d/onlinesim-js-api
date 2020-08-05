import OnlineSimDriver from "onlinesim-js-api";

const apikey = '';
const driver = new OnlineSimDriver(apikey)
driver.free().countries().then((result) => {
  console.log(result);
})
