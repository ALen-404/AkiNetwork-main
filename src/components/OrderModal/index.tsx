import React, {useEffect, useMemo, useState} from 'react';
import './index.less';
import {FormattedMessage, history, useIntl} from 'umi';
import {Modal} from 'antd';
import CountDownIcon from "@/assets/inscribe/pengding-icon.svg";
import MintedIcon from "@/assets/inscribe/minted-icon.svg";
import NotPaidIcon from "@/assets/inscribe/notPaid-icon.svg";
import {customTime, getOrderState, shortAddress, shortString} from "@/utils/utils";
import FileIcon from "@/assets/inscribe/file-icon.svg";
import {getOrderDetails, modifyOrderPut} from "@/services/http/api/mintApi";

type Order = {
  id: string,
  clientId: string,
  type: number,
  status: string,
  payAddress: string,
  receiveAddress: string,
  amount: number,
  count: number,
  feeRate: number,
  minerFee: number,
  serviceFee: number,
  exTime: number,
  createdAt: number,
  txId: string,
}

type Props = {
  modelStatus: boolean,
  setModelStatus: React.Dispatch<React.SetStateAction<boolean>>,
  orderInfo: Order,
  itemArr: any[],
  address: string,
  sliderValue: number,
}

const OrderModal = (
  {
    modelStatus,
    setModelStatus,
    orderInfo,
    itemArr,
    address,
    sliderValue,
  }: Props) => {
  const intl = useIntl();

  const [orderInfoMsg, setOrderInfoMsg] = useState(orderInfo);
  const orderStatus = [
    {
      status: 'pending',
      Icon: CountDownIcon,
      title: intl.formatMessage({
        id: 'OrderModal.orderStatus.pending.title',
      }),
      btnText: intl.formatMessage({
        id: 'OrderModal.orderStatus.pending.btnText',
      })
    },
    {
      status: 'inscribed',
      Icon: MintedIcon,
      title: intl.formatMessage({
        id: 'OrderModal.orderStatus.inscribed.title',
      }),
      btnText: intl.formatMessage({
        id: 'OrderModal.orderStatus.inscribed.btnText',
      })
    },
    {
      status: 'unpaid',
      Icon: NotPaidIcon,
      title: intl.formatMessage({
        id: 'OrderModal.orderStatus.unpaid.title',
      }),
      btnText: ''
    },
  ];
  const orderStatusInfo = useMemo(() => orderStatus.find((item) => item.status === orderInfoMsg?.status), [orderInfoMsg?.status])

  useEffect(() => {
    setOrderInfoMsg(orderInfo);
  }, [orderInfo]);

  // 唤起钱包支付
  const payWallet = async () => {
    if (orderStatusInfo?.status !== 'pending') return history.push('/inscribeOrders');
    if (orderInfoMsg?.txId) return;
    if (countdown === '00:00:00') return;
    let arr: any[] = [];
    itemArr.map(item => {
      arr.push({
        contentType: 'text/plain;charset=utf-8',
        body: item
      })
    })
    const result = await (window as any).okxwallet.bitcoin.mint({
      type: 50,
      from: address,
      inscriptions: arr
    });
    const resultInfo = {
      commitTx: result.commitTx,
      revealTxs: result.revealTxs,
      commitAddrs: result.commitAddrs,
      id: orderInfoMsg?.id
    }
    modifyOrder(resultInfo);
  }

  // 支付完成修改订单信息
  const modifyOrder = (resultInfo: any) => {
    const data = {
      commitTx: resultInfo.commitTx,
      revealTxs: resultInfo.revealTxs,
      commitAddrs: resultInfo.commitAddrs
    }
    modifyOrderPut({
      orderId: resultInfo.id,
      data
    }).then((res) => {
      console.log(res, 'modifyOrder')
    }).catch((err) => {
      console.error(err);
    })
  }

  // 关闭弹窗
  const closeModel = () => {
    setModelStatus(false);
    setCountdown('');
    clearInterval(interval);
    clearInterval(orderInterval);
    history.push('/inscribeOrders');
  }

  const [countdown, setCountdown] = useState('');
  let interval: any = null;
  let orderInterval: any = null;

  useEffect(() => {
    if (!modelStatus) return;
    if (!orderInfo || orderInfo.status !== 'pending') return;
    const targetTime = new Date(orderInfo?.exTime); // 将时间戳转换为日期对象
    interval = setInterval(() => {
      const currentTime = new Date(); // 当前时间
      // @ts-ignore
      const remainingTime = targetTime - currentTime; // 目标时间与当前时间的差异
      if (remainingTime > 0) {
        // 将毫秒转换为小时、分钟和秒
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        // 格式化倒计时
        const formattedCountdown = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setCountdown(formattedCountdown);
      } else {
        setCountdown('00:00:00');
      }

      if (remainingTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    orderInterval = setInterval(() => {
      // 每5秒获取信息
      showOrderDetails(orderInfo.id)
    }, 5000)

    return () => {
      clearInterval(interval);
      clearInterval(orderInterval);
    };
  }, [modelStatus]);

  // 获取订单详细信息
  const showOrderDetails = (id: string) => {
    getOrderDetails({id}).then((res) => {
      const data = res.data.data;
      setOrderInfoMsg(data);
    }).catch((err) => {
      console.error(err);
    })
  }

  return <Modal
    centered
    open={modelStatus}
    onCancel={() => setModelStatus(false)}
    closeIcon={false}
    footer={false}
    maskClosable={false}
    wrapClassName={'model'}
  >
    <div className={'model'}>
      <div className={'countdown'}>
        {orderStatusInfo?.title}
        {orderStatusInfo?.status === 'pending' ? <span className={'time'}> {countdown}</span> : <></>}
      </div>
      <div className={'countdownImg'}>
        <img src={orderStatusInfo?.Icon} width={60} height={60}/>
      </div>
      <div className={'orderInfo'}>
        <div className={'row'}>
          <div className={'title'}><FormattedMessage id="OrderModal.orderInfo.OrderID"/>:</div>
          <div className={'value'}>{orderInfo?.id}</div>
        </div>
        <div className={'row'}>
          <div className={'title'}><FormattedMessage id="OrderModal.orderInfo.ReceiveAddress"/>:</div>
          <div className={'value'}>{orderInfo ? shortAddress(orderInfo?.receiveAddress) : ''}</div>
        </div>
        <div className={'row'}>
          <div className={'title'}><FormattedMessage id="OrderModal.orderInfo.FeeRate"/>:</div>
          <div className={'value'}>{orderInfo?.feeRate} sats/vB</div>
        </div>
        <div className={'row'}>
          <div className={'title'}><FormattedMessage id="OrderModal.orderInfo.ServiceFee"/>:</div>
          <div className={'value'}>{orderInfo?.serviceFee} stas</div>
        </div>
        <div className={'row'}>
          <div className={'title'}><FormattedMessage id="OrderModal.orderInfo.TotalAmount"/>:</div>
          <div className={'btc'}>
            {orderInfo ? orderInfo?.amount / 100000000 : 0}
            <span className={'stas'}>BTC({orderInfo?.amount} stas)</span>
          </div>
        </div>
      </div>

      {
        orderStatusInfo?.status !== 'unpaid' ?
          <div className={'payWallet'} onClick={payWallet}>
            {orderStatusInfo?.btnText}
          </div>
          :
          <></>
      }

      <div className={'fileBlock'}>
        <div className={'fileText'}><FormattedMessage id="OrderModal.Files"/>({sliderValue})</div>
        <div className={'fileRow'}>
          {
            itemArr.map((item, index) => (
              <div className={'itemRow'} key={index}>
                <div className={'itemRow-left'}>
                  <img src={FileIcon} width={14} height={14}/>
                  <span className={'text'}>{shortString(item)}</span>
                </div>
                <div className={'itemRow-right'}>{getOrderState(orderStatusInfo?.status)}</div>
              </div>
            ))
          }
        </div>
      </div>

      <div className={'orderBottom'}>
        <div className={'orderCreate'}>
          <FormattedMessage id="OrderModal.OrderCreatedAt"/> {orderInfo ? customTime(orderInfo?.createdAt) : 0}
        </div>
        <div className={'closeButton'} onClick={closeModel}>
          <FormattedMessage id="OrderModal.close"/>
        </div>
      </div>

    </div>
  </Modal>
}

export default OrderModal;
