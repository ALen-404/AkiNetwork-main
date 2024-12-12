import React, {useEffect, useState} from 'react';
import './index.less'
import {connect, FormattedMessage} from 'umi';
import {Input} from 'antd';
import {generateRandomString, getUSDTPrice} from "@/utils/utils";
import BackIcon from '@/assets/inscribe/back-icon.svg';
import SlowIcon from '@/assets/inscribe/feeIcon/slow.svg';
import SlowActiveIcon from '@/assets/inscribe/feeIcon/slow-active.svg';
import FastIcon from '@/assets/inscribe/feeIcon/fast.svg';
import FastActiveIcon from '@/assets/inscribe/feeIcon/fast-active.svg';
import HyperIcon from '@/assets/inscribe/feeIcon/hyper.svg';
import HyperActiveIcon from '@/assets/inscribe/feeIcon/hyper-active.svg';
import TipsIcon from '@/assets/inscribe/tips-icon.svg';
import {feeFateFunc} from '../../utils/feeRate';
import OrderModal from "@/components/OrderModal";
import OKXModal from "@/components/OKXModal";
import LoadingBlock from "@/components/LoadingBlock";
import {getBTCPriceInfo, getGasFeeInfo} from "@/services/http/api/api";
import {createOrderPost} from "@/services/http/api/mintApi";

const {TextArea} = Input;

type Props = {
  tickName: string;
  amountValue: number | string;
  sliderValue: number;
  backTitle: string;
  goBack: Function;
  address: string;
  dispatch: any;
  limit?: number;
  loginStatus: boolean
}

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
}

function InscribeNext(
  {
    tickName,
    amountValue,
    sliderValue,
    backTitle,
    goBack,
    address,
    dispatch,
    limit,
    loginStatus,
  }: Props) {

  const [itemArr, setItemArr] = useState([]);
  const [receiveAddress, setReceiveAddress] = useState(address);
  const [hourFee, setHourFee] = useState(0);
  const [halfHourFee, setHalfHourFee] = useState(0);
  const [fastestFee, setFastestFee] = useState(0);
  const [btcPrice, setBtcPrice] = useState(0);

  // 费率
  const feeRateArr = [
    {icon: SlowIcon, activeIcon: SlowActiveIcon, value: hourFee, tips: 'Slow'},
    {icon: FastIcon, activeIcon: FastActiveIcon, value: halfHourFee, tips: 'Fast'},
    {icon: HyperIcon, activeIcon: HyperActiveIcon, value: fastestFee, tips: 'Hyper'},
  ];
  const [activeFee, setActiveFee] = useState(0);
  const itemStr = () => {
    if (backTitle === 'Mint') {
      return `{"p":"brc-20","tick":"${tickName}","op":"mint","amt":"${amountValue}"}`
    } else {
      return `{"p":"brc-20","op":"deploy","tick":"${tickName}","max":"${amountValue}","lim":"${limit}"}`
    }
  }

  // 费率计算信息
  const feeInfo = feeFateFunc(
    feeRateArr[activeFee].value,
    address,
    sliderValue,
    'text/plain;charset=utf-8'.length,
    itemStr().length * sliderValue,
    546,
  );

  const getFeeInfo = () => {
    getGasFeeInfo().then((res) => {
      setHourFee(res.data.hourFee);
      setHalfHourFee(res.data.halfHourFee);
      setFastestFee(res.data.fastestFee);
    }).catch((err) => {
      console.error(err);
      clearInterval(interval);
    })
  }

  // 定时器
  let interval: any = null;
  useEffect(() => {
    getFeeInfo();
    interval = setInterval(() => {
      getFeeInfo();
    }, 5000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    getBTCPrice();
  }, []);
  const getBTCPrice = () => {
    getBTCPriceInfo().then((res) => {
      setBtcPrice(Number(res.data.data.BTCPrice));
    }).catch((err) => {
      console.error(err);
    })
  }

  // 下载Okx钱包弹窗
  const [isModal, setIsModal] = useState(false);

  const [loading, setLoading] = useState(false);
  // 点击提交
  const clickSubmit = async () => {
    if (!feeRateArr[activeFee].value) return;
    if (receiveAddress) {
      createOrderInfo();
    } else {
      if ((window as any).okxwallet) {
        if ((window as any).okxwallet.bitcoin.selectedAccount) {
          await dispatch({type: 'aki/getSignMessage'});
        } else {
          await dispatch({type: 'aki/getWallet'});
          await dispatch({type: 'aki/getSignMessage'});
        }
      } else {
        setIsModal(true);
      }
    }
  };

  // 创建订单
  const createOrderInfo = () => {
    if (loading) return;
    setLoading(true);
    const timestamp = Date.now();
    const files = itemArr.map((item: any) => {
      return {
        dataURL: `data:text/plain;charset=utf-8;base64,${btoa(item)}`,
        filename: item
      }
    })
    const request = {
      clientId: `${timestamp}_${generateRandomString(10)}`,
      receiveAddress: receiveAddress,
      feeRate: feeRateArr[activeFee].value,
      files: files,
      amount: 546
    }
    createOrderPost({request})
      .then((res) => {
        setOrderInfo(res.data.data)
        setModalOpen(true);
      }).catch((err) => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    })
  }

  // 弹窗信息
  const [modalOpen, setModalOpen] = useState(false);
  const [orderInfo, setOrderInfo] = useState<Order>();

  const generateItem = () => {
    let arr: any = [];
    for (let i = 0; i < sliderValue; i++) {
      arr.push(itemStr())
    }
    setItemArr(arr)
  }

  useEffect(() => {
    generateItem();
  }, [sliderValue]);

  useEffect(() => {
    if (address && loginStatus) {
      setReceiveAddress(address);
    } else {
      setReceiveAddress('');
    }
  }, [address, loginStatus]);

  return (
    <div className={'inscribeNext'}>
      <div className={'backRow'}>
        <div onClick={() => goBack(false)} className={'back'}>
          <img src={BackIcon} width={16} height={8}/>
          <span className={'backText'}>{backTitle}</span>
        </div>
      </div>

      <div className={'itemBlock'}>
        <div className={'itemBlock-title'}>
          <span className={'itemBlock-title-text'}>{sliderValue} <FormattedMessage id="inscribe.item"/></span>
          <span className={'itemBlock-title-tips'}>({sliderValue} <FormattedMessage id="inscribe.item.tips"/>)</span>
        </div>
        <div className={'itemBlock-body'}>
          {
            itemArr.map((item: any, index) => (
              <div key={index} className={'itemBlock-body-item'}>
                <span className={'itemBlock-body-item-index'}>{index + 1}.</span>
                <span>{item}</span>
              </div>
            ))
          }
        </div>
      </div>

      <div className={'receive'}>
        <div className={'receive-title'}><FormattedMessage id="inscribe.Receive"/></div>
        <div className={'receive-Input'}>
          <TextArea
            placeholder={'bc1pk3xs...js2v6fs6vs'}
            bordered={false}
            value={receiveAddress}
            autoSize={true}
          />
        </div>
      </div>

      <div className={'feeRate'}>
        <div className={'feeRate-title'}><FormattedMessage id="inscribe.FeeRate"/></div>
        <div className={'feeRate-body'}>
          <div className={'feeRate-body-left'}>
            {
              feeRateArr.map((item, index) => (
                <div
                  className={activeFee === index ? 'feeBlock feeBlockActive' : 'feeBlock'}
                  key={index}
                  onClick={() => setActiveFee(index)}
                >
                  <div className={'feeBlockLeft'}>
                    <img src={activeFee === index ? item.activeIcon : item.icon} width={40} height={30}/>
                    <div className={'leftText'}>
                      <span className={'value'}>{item.value}</span>
                      <span className={'unit'}>sats/vB</span>
                    </div>
                  </div>
                  <div className={'feeBlockRight'}>
                    {item.tips}
                  </div>
                </div>
              ))
            }
          </div>

          <div className={'feeRate-body-right'}>
            <div className={'tips'}>
              <img src={TipsIcon} width={20} height={20}/>
              <span className={'tipsText'}>
              <FormattedMessage id="inscribe.FeeRate.tips"/>
              </span>
            </div>

            <div className={'feeBox'}>
              <div className={'feeBox-row'}>
                <div className={'left'}>
                  <span className={'leftTitle'}><FormattedMessage id="inscribe.fee.Sats.Inscription"/></span>
                </div>

                <div className={'right'}>
                  <div className={'stas'}>{feeInfo.balance} Sats</div>
                  <div className={'dollar'}>~${getUSDTPrice(feeInfo.balance, btcPrice)}</div>
                </div>
              </div>

              <div className={'feeBox-row'}>
                <div className={'left'}>
                  <span className={'leftTitle'}><FormattedMessage id="inscribe.fee.Sats.Network"/></span>
                </div>

                <div className={'right'}>
                  <div className={'stas'}>~{feeInfo.networkSats} Sats</div>
                  <div className={'dollar'}>~${getUSDTPrice(feeInfo.networkSats, btcPrice)}</div>
                </div>
              </div>
            </div>

            <div className={'feeBox'}>
              <div className={'feeBox-row'}>
                <div className={'left'}>
                  <span className={'leftTitle'}><FormattedMessage id="inscribe.fee.Sats.Service"/> </span>
                </div>

                <div className={'right'}>
                  <div className={'stas'}><FormattedMessage id="inscribe.fee"/></div>
                  <div className={'dollar'}>$0</div>
                </div>
              </div>

              <div className={'feeBox-row'}>
                <div className={'left'}>
                  <span className={'leftTitle'}>+ <FormattedMessage id="inscribe.fee.Size"/></span>
                </div>

                <div className={'right'}>
                  <div className={'stas'}><FormattedMessage id="inscribe.fee"/></div>
                  <div className={'dollar'}>$0</div>
                </div>
              </div>

              <div className={'feeBox-row'}>
                <div className={'left'}>
                  <span className={'leftTitle'}>=</span>
                </div>

                <div className={'right'}>
                  <div className={'stas'}>0 Sats</div>
                  <div className={'dollar'}>$0</div>
                </div>
              </div>
            </div>

            <div className={'total'}>
              <div className={'totalText'}><FormattedMessage id="inscribe.fee.Total"/></div>
              <div className={'right'}>
                <div className={'stas'}>~{feeInfo.total} Sats</div>
                <div className={'dollar'}>~${getUSDTPrice(feeInfo.total, btcPrice)}</div>
              </div>
            </div>

            <div className={'submitBtn'} onClick={clickSubmit}>
              {
                loginStatus ?
                  !loading ?
                    'Submit'
                    :
                    <LoadingBlock loading={loading} size={'small'} padding={0}/>
                  :
                  'Connect Wallet'
              }
            </div>

          </div>
        </div>
      </div>

      <OrderModal modelStatus={modalOpen} setModelStatus={setModalOpen} orderInfo={orderInfo} itemArr={itemArr}
                  address={address} sliderValue={sliderValue}/>

      <OKXModal isModal={isModal} setIsModal={setIsModal}/>
    </div>
  )
}

export default connect(({props, aki}: any) => ({
  props,
  address: aki.address,
  loginStatus: aki.loginStatus
}))(InscribeNext);
