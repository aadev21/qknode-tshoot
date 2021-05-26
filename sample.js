const ethers = require('ethers');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const addresses = {
    CUSTOM: '0x57c9487f30d04aee52d323586ec9a23d05a1504e',
    WBNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    factory: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
    router: '0x10ED43C718714eb63d5aA57B78B54704E256024E', 
    recipient: 'BSC_ADDRESS'
}

const tokenOut = addresses.CUSTOM;
const tokenIn = addresses.WBNB;
const AmountToBuy = '0.0001';
const defaultGasPrice = ethers.BigNumber.from(9000000000);
const defaultGasLimit = 1200000;
const pk ='BSC_PRIVATE_KEY'; 
const provider = new ethers.providers.WebSocketProvider('WSS_ENDPOINT');
const wallet = new ethers.Wallet(pk);
const account = wallet.connect(provider);
const router = new ethers.Contract(
  addresses.router,
  [
    'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint256 deadline) external returns (uint[] memory amounts)'
  ],
  account 
);

const amountIn = ethers.utils.parseUnits(AmountToBuy, 'ether');
router.swapExactETHForTokens(
0 ,
[tokenIn, tokenOut],
addresses.recipient,
Date.now() + 1000 * 60
,  { gasPrice: defaultGasPrice, gasLimit: defaultGasLimit, value: amountIn }
).then(function(resTx) {
    //Can't reach here sometimes
    console.log(`
    Transaction
    =================
    `);
    if(typeof resTx.wait === 'function'){
        resTx.wait().then(function(resultTx){
        console.log(resultTx);
        }).catch(function(err){
        console.error(err);
        });
    }
}).catch(function(err){
    //Didn't reach here too
    console.error(err); 
}); // this return sometimes a never ending promise