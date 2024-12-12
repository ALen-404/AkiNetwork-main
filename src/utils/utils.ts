export const shortAddress = (longAddress: string): string => {
  return (
    longAddress.substring(0, 6) +
    "..." +
    longAddress.substring(longAddress.length - 4, longAddress.length)
  );
};

export const shortString = (str: string): string => {
  return (
    str.substring(0, 8) +
    "..." +
    str.substring(str.length - 8, str.length)
  );
};

const rankState = {
  "0": "直推",
  "1": "星级",
  "2": "节点",
}

export const getRankState = (state: string) => {
  return rankState[state] || "未知状态"
}

const orderState = {
  'pending': "Pending",
  'inscribed': "Minted",
  'unpaid': "Notpaid",
}

export const getOrderState = (state: string) => {
  return orderState[state]
}

export const generateRandomString = (num: number) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export const customTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  };
  const formattedDate = date.toLocaleString('en-US', options);
  return formattedDate
}

export const getUSDTPrice = (value: number, unit: number) => {
  return (value / 100000000 * unit).toFixed(2)
}

export const changeType = (type: string) => {
  const parts = type.split('/')[0]
  if (parts === 'text') {
    return 'Text'
  } else if (parts === 'image') {
    return 'Image'
  } else {
    return 'other'
  }
}

export const getTransferFrom = (type: string, item: any) => {
  if (type === 'deploy' || type === 'mint' || type === 'transfer') {
    return ''
  } else {
    return item[type].from_address
  }
}

export const getAmount = (type: string, item: any) => {
  if (type === 'deploy') {
    return '--'
  } else {
    return Number(Number(item[type].amount).toFixed(0))
  }
}

export const numberCommas = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}




