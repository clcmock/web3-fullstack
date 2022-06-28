const Web3 = require('web3')

const RpcUrl = 'wss://muddy-dry-glade.bsc.quiknode.pro/756c7b9ad17e8170e47925d7b56be9e102919b17/'
//const RpcUrl = 'wss://speedy-nodes-nyc.moralis.io/e7c8678fd9bdbeabd9350d8e/bsc/mainnet/ws'
const web3 = new Web3(RpcUrl)


let skip = 0
web3.eth.subscribe('logs', {
    address: '0x3882BF7AD77B147Ba3e766a47AEAD6Cf4a57417d',
    topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']
}, function (error, result) {
    if (error) console.log(error)
    if (!error) {
        if (skip == 0)
            console.log('ok')
        skip = skip + 1
    }
}).on("data", function (logs) {
    console.log(logs)
});
