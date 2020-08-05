import OnlineSimDriver from "onlinesim-js-api/dist";

const apikey = 'apikey';
const driver = new OnlineSimDriver(apikey)
driver.rent().tariffsOne().then((result) => {
  console.log(result);
})
