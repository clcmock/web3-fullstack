const express = require('express');
const app = express();
const port = 3001;



app.all('*', (req, res, next) => {
  res.append('Access-Control-Allow-Origin', '*');
  res.append('Access-Control-Allow-Headers', 'content-type');
  res.append('Access-Control-Allow-Methods', 'GET');
  next();
})

app.get('/', (req, res) => {
  const symbolList = ['eth', 'usd', 'shibi', 'doge', 'bnb', 'trx', 'sub', 'wbnb'];
  const newData = symbolList.map(() => {
    const idx = Math.ceil(Math.random() * 7 + 1);
    return {
      "id": Math.random().toString().slice(3),
      "blockNumber": Math.ceil(Math.random() * 100000 + 12200000),
      "symbol": symbolList[idx],
      "coinPrice": 1298.87,
      "leaseEnd": Math.ceil(Math.random() * 100000 + 12400000),
      "createdTimestamp": new Date(Date.now() + Math.random() * 9000000 + 10000000),
      "status": Math.floor(Math.random() * 3) + 1
    }
  });
  res.status(200).json({
    data: newData
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})