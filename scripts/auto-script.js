const lotteryAbi = require("./lottery.json");
const Web3 = require("web3");

const fromAddress = "0xA1fc0e50D10f5A8887367a50297Abc9F7c545009";
const toAddress = "0xB8c1b020921155373Ac667a8Aa29A4b0F3637a80";

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://bsc-dataseed.binance.org"
  )
);

const lottery = new web3.eth.Contract(lotteryAbi, toAddress);

const enterDrawing  = async () =>  {
  const nonce = await web3.eth.getTransactionCount(fromAddress);
  const gasPriceWei = await web3.eth.getGasPrice();
  const data = lottery.methods.enterDrawingPhase().encodeABI()

  const signedTx  = await web3.eth.accounts.signTransaction({
      to: toAddress,
      gas: 2000000,
      data: data,
      gasPrice: gasPriceWei,
      nonce: nonce,
      chainId: 56
  }, privateKey)

  await web3.eth.sendSignedTransaction(signedTx.rawTransaction || signedTx.rawTransaction);

}

const drawing = async () => {
  const nonce = await web3.eth.getTransactionCount(fromAddress);
  const gasPriceWei = await web3.eth.getGasPrice();
  const randomNumber = Math.floor((Math.random() * 10) + 1);
  const data = lottery.methods.drawing(randomNumber).encodeABI()

  const signedTx  = await web3.eth.accounts.signTransaction({
      to: toAddress,
      gas: 2000000,
      data: data,
      gasPrice: gasPriceWei,
      nonce: nonce,
      chainId: 56
  }, privateKey)

  await web3.eth.sendSignedTransaction(signedTx.rawTransaction || signedTx.rawTransaction);
};

const reset = async () => {
  const nonce = await web3.eth.getTransactionCount(fromAddress);
  const gasPriceWei = await web3.eth.getGasPrice();

  const signedTx  = await web3.eth.accounts.signTransaction({
      to: toAddress,
      gas: 2000000,
      data: '0xd826f88f',
      gasPrice: gasPriceWei,
      nonce: nonce,
      chainId: 56
  }, privateKey)

  await web3.eth.sendSignedTransaction(signedTx.rawTransaction || signedTx.rawTransaction);
};

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function main() {
  while(1) {
    await sleep(10000);
    const time = Date.parse(new Date()) / 1000;

    if((time + 75600) % 259200 < 18) {
      try {
        await reset()
      }
      catch(err) {
        console.log(err)
      }
    }

    else if((time + 79200) % 259200 < 18) {
      try {
        await enterDrawing()
        await drawing()
      }
      catch(err) {
        console.log(err)
      }
    }
  }
}

main();

