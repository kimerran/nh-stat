// request is 
// https://api.nicehash.com/api?method=stats.provider.ex&addr=3NdcSgWkuH1NQVbpijWQqKftSoXUTkb5mm

const axios = require('axios');
const btc_address = process.argv[2];

console.log('BTC Address:', btc_address);

function sendEmailNotification() {
  console.log('sending email notification...');
}

function performAPIStatsCall() {
  axios.get(`https://api.nicehash.com/api?method=stats.provider.ex&addr=${btc_address}`)
  .then(axiosResponse => {
  
    const {result} = axiosResponse.data;
  
    if (result.error) {
      console.log(result.error);
  
    } else {
  
      const {current} = axiosResponse.data.result;
      
      let profitability = 0;
      
      current.forEach(function(element) {
        
        const {a} = element.data[0];
        if (a) {
          profitability += (a * element.profitability);
        }
        
      }, this);
      
      
      const ncResult = {
        profitability_btc: `${profitability} BTC`,
        profitability_mbtc: `${profitability * 1000} mBTC`,
      }
  
      // when down profitability === 0
      // { profitability_btc: '0 BTC', profitability_mbtc: '0 mBTC' }
      console.log(ncResult);

      if (profitability === 0) {
        sendEmailNotification();
      }
    }
  });
}


const MINUTES = process.env.INTERVAL || 1;
const INTERVAL = MINUTES * 60 * 1000;

performAPIStatsCall();
setInterval(() => {
  performAPIStatsCall();
}, INTERVAL);


console.log('started');

