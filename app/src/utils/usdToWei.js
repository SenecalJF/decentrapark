import axios from 'axios';

const usdToWei = async (usd) => {
  const ticker = await axios.get('https://api.kraken.com/0/public/Ticker?pair=ETHUSDT');
  let price = parseFloat(ticker.data.result.ETHUSDT.c[0]);
  const value = (usd / price) * Math.pow(10, 18);
  return Math.round(value);
};

export default usdToWei;
