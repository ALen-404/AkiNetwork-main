import moment from 'moment';

const formatTime = {
  day: 'YYYY-MM-DD',
  hour: 'YYYY-MM-DD HH',
  minute: 'YYYY-MM-DD HH:mm',
  second: 'YYYY-MM-DD HH:mm:ss'
}

const formate = (dateTime: number | string, type?: string) => {
  // @ts-ignore
  const matchedValue = formatTime[type];
  const formattedDate = moment(Number(dateTime) * 1000).format(matchedValue || formatTime.minute);
  return formattedDate;
}

export default formate;
