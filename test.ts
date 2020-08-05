import OnlineSimDriver from "./src";

const apikey = 'apikey';
const driver = new OnlineSimDriver(apikey)
driver.rent().tariffsOne().then((result) => {
  console.log(result);
})
