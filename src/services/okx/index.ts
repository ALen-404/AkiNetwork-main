/**
 * 查询地址并且设置地址监听器
 * @param addressEventListener 地址监听器，当地址发生变化时，会调用该监听器
 * @returns
 */
function getAddress() {
  if ((window as any).okxwallet) {
    return new Promise((resolve, reject) => {
      (window as any).okxwallet.bitcoin.connect()
        .then((result: any) => {
          resolve({ address: result.address });
        })
        .catch((error: any) => {
          console.log('error')
        });
    });
  } else {
    return Promise.resolve(null);
  }
}

function getEvmAddress() {
  if ((window as any).okxwallet) {
    return new Promise((resolve, reject) => {
      (window as any).okxwallet.request({ method: 'eth_requestAccounts' })
        .then((result: any) => {
          resolve({ address: result[0] });
        })
        .catch((error: any) => {
          console.log('error')
        });
    });
  } else {
    return Promise.resolve(null);
  }
}

function getSignMessage() {
  const signStr = 'I authorize connecting my wallet to AkiNetwork';
  if ((window as any).okxwallet) {
    return new Promise((resolve, reject) => {
      (window as any).okxwallet.bitcoin.signMessage(signStr, 'ecdsa')
        .then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          console.log('error')
        });
    });
  } else {
    return Promise.resolve(null);
  }
}

function switchEvmNeowork() {
  const chain_id = "0x13881"
  if ((window as any).okxwallet) {
    return new Promise((resolve, reject) => {
      (window as any).okexchain.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chain_id }]
      })
        .then((result: any) => {
          resolve(result);
        })
        .catch((error: any) => {
          console.log('error')
        });
    });
  } else {
    return Promise.resolve(null);
  }
}

export { getAddress, getEvmAddress, getSignMessage,switchEvmNeowork };
