const Web3 = require('web3');
// const RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const RPC_URL = 'https://bsc-dataseed4.ninicoin.io'
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 }));


// heartbeat Number
let intervalNumber ;

// transcation result callback
let hashSuccessBlock ;

// judge hashId
let listenHashId = '';


async function startTokenListen(tokenAbi, tokenAddress, fromAddress) {

    // const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
    // console.log(await tokenContract.methods.balanceOf(fromAddress).call())
    console.log('start transaction listen');

    clearInterval(intervalNumber);
    // 五秒轮询一次
    intervalNumber = setInterval(function () {
        try {
            web3.eth.getBlockNumber().then(function (fromBlockNumber ) {
                tokenContract.getPastEvents('Transfer', {
                    fromBlock: 20592800,
                    filter: {from: fromAddress}
                }, function(error, events){
                    if (error) {
                        console.log(error)
                        return;
                    }
                   
                }).then(function(events) {
                    console.log(events)
                });
            });
        } catch (err) {
            console.log(err)
        }
        

    }, 1000 * 5);
}


function judgeObjCalss(obj,className) {

    if (className.indexOf('arr') !== -1 ){

        return Object.prototype.toString.call(obj) === '[object Array]';
    }
}

const bep20Abi = require('../src/config/abi/erc20.json');
const tokenAddress = '0x3882BF7AD77B147Ba3e766a47AEAD6Cf4a57417d';
const account = '0x01C31F8e778F248c45BfC9129f0Fd547D46ffcB2'
startTokenListen(bep20Abi, tokenAddress, account);
