export const feeFateFunc = (
  feeRateVal: number,
  addrs: string,
  fileNum: number,
  contentSize: number,
  fileSizeNum: number,
  inscriptionBalanceNum: number
) => {
  const address = addrs; // the receiver address 接受地址
  const inscriptionBalance = inscriptionBalanceNum; // the balance in each inscription 最低546 低于546 btc会认为没有价值
  const fileCount = fileNum; // the fileCount // 文件个数
  const fileSize = fileSizeNum; // the total size of all files // 文件大小 就是length
  const contentTypeSize = contentSize; // the size of contentType // (text/plain;charset=utf-8).length()
  const feeRate = feeRateVal; // the feeRate
  const feeFileSize = 100; // the total size of first 25 files  前25个文件的大小
  const feeFileCount = 25 // do not change this 不改变
  const devFee = 1000; // the fee for developer  查询订单详情中有这个

  const balance = inscriptionBalance * fileCount;

  let addrSize = 25 + 1; // p2pkh
  if (address) {
    if (address.indexOf('bc1q') == 0 || address.indexOf('tb1q') == 0) {
      addrSize = 22 + 1;
    } else if (address.indexOf('bc1p') == 0 || address.indexOf('tb1p') == 0) {
      addrSize = 34 + 1;
    } else if (address.indexOf('2') == 0 || address.indexOf('3') == 0) {
      addrSize = 23 + 1;
    }
  } else {
    addrSize = 25 + 1
  }


  const baseSize = 88;
  let networkSats = Math.ceil(((fileSize + contentTypeSize) / 4 + (baseSize + 8 + addrSize + 8 + 23)) * feeRate);
  if (fileCount > 1) {
    networkSats = Math.ceil(((fileSize + contentTypeSize) / 4 + (baseSize + 8 + addrSize + (35 + 8) * (fileCount - 1) + 8 + 23 + (baseSize + 8 + addrSize + 0.5) * (fileCount - 1))) * feeRate);
  }
  let networkSatsByFeeCount = Math.ceil(((feeFileSize + contentTypeSize) / 4 + (baseSize + 8 + addrSize + 8 + 23)) * feeRate);
  if (fileCount > 1) {
    networkSatsByFeeCount = Math.ceil((((feeFileSize) + contentTypeSize * (feeFileCount / fileCount)) / 4 + (baseSize + 8 + addrSize + (35 + 8) * (fileCount - 1) + 8 + 23 + (baseSize + 8 + addrSize + 0.5) * Math.min(fileCount - 1, feeFileCount - 1))) * feeRate);
  }

  const baseFee = 1999 * Math.min(fileCount, feeFileCount); // 1999 base fee for top 25 files
  const floatFee = Math.ceil(networkSatsByFeeCount * 0.0499); // 4.99% extra miner fee for top 25 transations
  const serviceFee = Math.floor(baseFee + floatFee);

  const total = balance + networkSats;
  const truncatedTotal = Math.floor((total) / 1000) * 1000; // truncate
  const amount = truncatedTotal + devFee; // add devFee at the end

  return {
    addrSize,
    networkSats,
    inscriptionBalance,
    total,
    balance
  }
}
