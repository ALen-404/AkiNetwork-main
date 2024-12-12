import React, {useEffect, useMemo, useState} from 'react';
import './index.less'
import {Input} from "antd";
import InscribeNext from "@/components/InscribeNext";
import {FormattedMessage, useIntl} from 'umi';
import {getTickInfoRequest} from "@/services/http/api/api";

const Deploy: React.FC = () => {

  const intl = useIntl();

  const limitPlaceholder = intl.formatMessage({
    id: 'inscribe.deploy.Limit.placeholder',
  })
  const supplyPlaceholder = intl.formatMessage({
    id: 'inscribe.deploy.Supply.placeholder',
  })

  const [tickName, setTickName] = useState<string>('');
  const [totalValue, setTotalValue] = useState<number>(21000000);
  const [limitValue, setLimitValue] = useState<number>(1);
  const [sliderValue, setSliderValue] = useState<number>(1);
  const [isRemain, setIsRemain] = useState(false);
  const permissible = useMemo(() => tickName.length === 4 && totalValue && limitValue && !isRemain, [tickName, totalValue, sliderValue, isRemain]);
  const [showNext, setShowNext] = useState(false);

  // 更改TickName
  const onChangeTickName = (e: any) => {
    setTickName(e.target.value)
  }

  const requestTickInfo = (tick: string) => {
    getTickInfoRequest({tick}).then((res) => {
      setIsRemain(true);
    }).catch((err) => {
      setIsRemain(false);
      console.error(err)
    })
  }

  useEffect(() => {
    if (tickName.length === 4) {
      requestTickInfo(tickName)
    } else {
      setIsRemain(false);
    }
  }, [tickName])

  // 更改金额
  const onChangeAmount = (e: any) => {
    setTotalValue(e.target.value);
  }

  // 矫正金额
  const onBlurAmount = () => {
    if (!Number(totalValue) || totalValue < 1) return setTotalValue(1);
  }

  // 更改limit
  const onChangeLimit = (e: any) => {
    setLimitValue(e.target.value);
  }

  // 矫正limit
  const onBlurLimit = () => {
    if (!Number(limitValue) || limitValue < 1) return setLimitValue(1);
  }

  // 点击Next
  const clickNext = () => {
    if (!permissible) return;
    setShowNext(true);
  }

  return (
    <>
      {
        !showNext ?
          <div className={'deploy'}>

            <div className={'inputInfo'}>
              <div className={'inputInfo-title'}><FormattedMessage id="mint.Tick"/></div>
              <div className={'inputInfo-info'}>
                <Input
                  placeholder="Tick name"
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
                {
                  isRemain &&
                  `${tickName} ` + intl.formatMessage({
                    id: 'mint.Tick.deployed',
                  })
                }
              </div>
            </div>

            <div className={'inputInfo'}>
              <div className={'inputInfo-title'}><FormattedMessage id="mint.Tick.TotalSupply"/></div>
              <div className={'inputInfo-info'}>
                <Input
                  placeholder={supplyPlaceholder}
                  bordered={false}
                  value={totalValue}
                  onChange={onChangeAmount}
                  onBlur={onBlurAmount}
                  type={'number'}
                />
              </div>
            </div>

            <div className={'inputInfo'}>
              <div className={'inputInfo-title'}><FormattedMessage id="mint.Tick.Limit"/></div>
              <div className={'inputInfo-info'}>
                <Input
                  placeholder={limitPlaceholder}
                  bordered={false}
                  value={limitValue}
                  onChange={onChangeLimit}
                  onBlur={onBlurLimit}
                />
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
            amountValue={totalValue}
            sliderValue={1}
            limit={limitValue}
            backTitle={'Deploy'}
            goBack={setShowNext}
          />
      }
    </>
  )
}

export default Deploy
