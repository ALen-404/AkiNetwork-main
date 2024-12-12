import React, {useEffect, useMemo, useState} from 'react';
import './index.less'
import {Col, Input, InputNumber} from "antd";
import WarningIcon from '@/assets/inscribe/warning-icon.svg';
import InscribeNext from "@/components/InscribeNext";
import {FormattedMessage, useIntl} from 'umi';
import ProgressBlock from "@/components/ProgressBlock";
import SliderBlock from "@/components/SliderBlock";
import {getTickInfoRequest} from "@/services/http/api/api";

type Props = {
  tick: string | null
}

const Mint = ({tick}: Props) => {

  const intl = useIntl();
  const amountPlaceholder = intl.formatMessage({
    id: 'mint.Tick.Amount.placeholder',
  })
  const tickNamePlaceholder = intl.formatMessage({
    id: 'mint.Tick.name.placeholder',
  })


  const tickProps = useMemo(() => tick ? tick : '', [tick]);
  const [isMintInfo, setIsMintInfo] = useState(false);
  const [tickName, setTickName] = useState<string>(tickProps);
  const [amountValue, setAmountValue] = useState<number | string>('');
  const [sliderValue, setSliderValue] = useState<number>(1);
  const [showNext, setShowNext] = useState(false);
  const [tickInfo, setTickInfo] = useState({
    address: '',
    max: 0,
    limit: 0,
    minted: 0,
    number: 0,
    percent: 0,
  });
  const permissible = useMemo(() => tickName && amountValue && sliderValue && isMintInfo && tickInfo.percent < 100, [tickName, amountValue, sliderValue]);

  // 判断顶部是否展示
  useEffect(() => {
    if (tickName.length === 4) {
      requestTickInfo(tickName);
    } else {
      setIsMintInfo(false);
      setAmountValue('')
      setTickInfo({
        address: '',
        max: 0,
        limit: 0,
        minted: 0,
        number: 0,
        percent: 0,
      })
    }
  }, [tickName]);

  // 更改TickName
  const onChangeTickName = (e: any) => {
    setTickName(e.target.value)
  }

  // 获取tick信息
  const requestTickInfo = (tick: string) => {
    getTickInfoRequest({tick}).then((res) => {
      const response = {
        address: res.data.token.address,
        max: Number(Number(res.data.token.max_supply).toFixed(0)),
        limit: Number(Number(res.data.token.mint_limit).toFixed(0)),
        minted: Number(Number(res.data.token.minted_supply).toFixed(0)),
        number: res.data.token.number,
        percent: Number(((Number(Number(res.data.token.minted_supply).toFixed(0)) / Number(Number(res.data.token.max_supply).toFixed(0))) * 100).toFixed(2)),
      }
      setTickInfo(response)
      setIsMintInfo(true);
      setAmountValue(response.limit);
    }).catch((err) => {
      console.error(err)
    })

  }

  // 更改金额
  const onChangeAmount = (e: any) => {
    if (e.target.value > tickInfo.limit) {
      return setAmountValue(tickInfo.limit);
    }
    setAmountValue(e.target.value);
  }

  // 矫正金额
  const onBlurAmount = () => {
    if (!Number(amountValue)) return setAmountValue(1);
  }

  // 更改滑块的值
  const onChangeSlider = (newValue: any) => {
    setSliderValue(newValue);
  };

  // 点击Next
  const clickNext = () => {
    if (!permissible) return;
    setShowNext(true);
  }

  return (
    <>
      {
        !showNext ?
          <div className={'mint'}>
            {
              !isMintInfo ?
                <div className={'mintInfo'}>
                  <div className={'mintInfo-tips'}>
                    <FormattedMessage id="mint.tips"/>
                  </div>
                </div>
                :
                <div className={'mintInfo'}>
                  <div className={'mintInfo-show'}>
                    <div className={'mintInfo-show-row'}>
                      <span className={'spanText'}>{tickName}</span>
                      <div className={'line'}/>
                      <span className={'spanText'}>#{tickInfo.number}</span>
                    </div>
                    <div className={'progress'}>
                      <ProgressBlock value={tickInfo.percent}/>
                    </div>
                  </div>
                </div>
            }

            <div className={'inputInfo'}>
              <div className={'inputInfo-title'}><FormattedMessage id="mint.Tick"/></div>
              <div className={'inputInfo-info'}>
                <Input
                  placeholder={tickNamePlaceholder}
                  bordered={false}
                  onChange={onChangeTickName}
                  maxLength={4}
                  value={tickName}
                />
              </div>
              <div className={'errorInfo'}>
                {
                  tickName.length < 4 && tickName.length > 0 &&
                    <FormattedMessage id="mint.Tick.length.tip"/>
                }
              </div>
            </div>

            <div className={'inputInfo'}>
              <div className={'inputInfo-title'}><FormattedMessage id="mint.Tick.Amount"/></div>
              <div className={'inputInfo-info'}>
                <Input
                  placeholder={amountPlaceholder}
                  bordered={false}
                  value={amountValue}
                  onChange={onChangeAmount}
                  onBlur={onBlurAmount}
                />
              </div>
            </div>

            <div className={'slider'}>
              <div className={'slider-title'}><FormattedMessage id="mint.Tick.BulkMint"/></div>
              <div className={'slider-row'}>
                <Col span={17}>
                  <SliderBlock min={1} max={1000} onChangeFun={onChangeSlider} value={sliderValue}/>
                </Col>
                <Col span={6}>
                  <InputNumber
                    min={1}
                    max={1000}
                    value={sliderValue}
                    bordered={false}
                    onChange={onChangeSlider}
                  />
                </Col>
              </div>
            </div>

            <div className={'warningInfo'}>
              <img src={WarningIcon} className={'warning-icon'}/>
              <div className={'warning-text'}>
                <span>
                  <FormattedMessage id="mint.Warning.text1"/>
                </span>
                <span>
                  <FormattedMessage id="mint.Warning.text2"/>
                </span>
              </div>
            </div>
            <div
              className={permissible ? 'nextButton permissible' : 'nextButton'}
              onClick={clickNext}
            >
              <FormattedMessage id="mint.Tick.btn.Next"/>
            </div>

          </div>
          :
          <InscribeNext
            tickName={tickName}
            amountValue={amountValue}
            sliderValue={sliderValue}
            backTitle={'Mint'}
            goBack={setShowNext}
          />
      }
    </>
  )
}

export default Mint
