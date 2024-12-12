import React, {useEffect, useState} from "react";
import './index.less';
import {connect, FormattedMessage} from "umi";
import BRC20Icon from '@/assets/inscribe/brc20-icon.svg';
import Brc20TopTable from "@/components/Brc20TopTable";
import {numberCommas} from "@/utils/utils";
import {getShowOrderDetails} from "@/services/http/api/api";

function Page() {
  const [brc20Info, setBrc20Info] = useState({
    ticks: 0,
    holders: 0,
    transActions: 0
  })

  useEffect(() => {
    showOrderDetails()
  }, []);

  const showOrderDetails = () => {
    getShowOrderDetails().then((res) => {
      const result = res.data;
      setBrc20Info({
        ticks: result.total,
        holders: result.holders,
        transActions: result.tx_count
      })
    }).catch((err) => {
      console.error(err);
    })
  }

  return (
    <div className={'index'}>
      <div className={'index-header'}>
        <div className={'header-top'}>
          <img src={BRC20Icon} className={'brc20Img'}/>
        </div>
        <div className={'header-bottom'}>
          <div className={'header-left'}>
            <div className={'title'}>BRC20</div>
            <div className={'tips'}><FormattedMessage id="index.brc20.detail.tips"/></div>
          </div>
          <div className={'brc20Info'}>
            <div className={'infoBlock'}>
              <div className={'info-title'}>
                <FormattedMessage id="index.brc20.detail.TICKS"/>
              </div>
              <div className={'info-value'}>
                {numberCommas(brc20Info.ticks)}
              </div>
            </div>
            <div className="infoLine"/>
            <div className={'infoBlock'}>
              <div className={'info-title'}>
                <FormattedMessage id="index.brc20.table.header.HOLDERS"/>
              </div>
              <div className={'info-value'}>
                {numberCommas(brc20Info.holders)}
              </div>
            </div>
            <div className="infoLine"/>
            <div className={'infoBlock'}>
              <div className={'info-title'}>
                <FormattedMessage id="index.brc20.table.header.TRANSACTIONS"/>
              </div>
              <div className={'info-value'}>
                {numberCommas(brc20Info.transActions)}
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <Brc20TopTable/>
    </div>
  )
}

export default connect(({}: any) => ({}))(Page);
