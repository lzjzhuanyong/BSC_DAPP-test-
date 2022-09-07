const Web3 = require("web3");
const fs = require("fs");

const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');

//please add your own privatekey
const privatekey = ""; 

const account1 = web3.eth.accounts.privateKeyToAccount(privatekey);
//const account2 = "";

//console.log(account1);

let bytecode_path = __dirname + '/BEP20_bytecode.json';

//read the bytecode file and change the bytecode type as object
let bytecode = fs.readFileSync(bytecode_path,"utf-8");
bytecode = JSON.parse(bytecode);

//console.log(JSON.stringify(bytecode_test3) === JSON.stringify(bytecode));


const data = "0x" + bytecode.object;


async function getTransactionCount(address){
    let countTx = await web3.eth.getTransactionCount(address);
    return countTx
}

async function getGasPrice(){
    let gasPrice = await web3.eth.getGasPrice();
    return gasPrice
}

async function signTransaction(data,privatekey){
    let nonce = await getTransactionCount(account1.address);
    let gasPrice = await getGasPrice();
    let tx = {
        nonce: nonce,
        //value: 100000000000000000,
        gas: '1500000', //1 million gas seems not enough, so change it to 1,500,000 gas.
        gasPrice: gasPrice,
        data: data
    }

    let signedData = await web3.eth.accounts.signTransaction(tx, privatekey);
    return signedData.rawTransaction;
}


async function sendSignedTransaction(){
    let signedTransactionData = await signTransaction(data,privatekey);
    console.log(signedTransactionData)
    web3.eth.sendSignedTransaction(signedTransactionData).on('receipt', console.log);
}

sendSignedTransaction();
