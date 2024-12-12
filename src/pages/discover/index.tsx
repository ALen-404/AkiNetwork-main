import React, {useEffect, useState} from "react";
import './index.less';
import {connect, FormattedMessage} from "umi";
import Rotational from "@/components/Rotational";
import MintRankTable from '@/components/MintRankTable'
import Transactions from "@/components/Transactions";
import HoverBoxImg from '@/assets/hoverBoxImg.png';
import ReferIcon from '@/assets/refer-icon.svg';
import TasksIcon from '@/assets/tasks-icon.svg';
import StakeIcon from '@/assets/stake-icon.svg';
import ExploreIcon from '@/assets/explore-icon.svg';
import HoverArrow from '@/assets/discover/hover-arrow.svg';
import HoverIcon from '@/assets/discover/hover-icon.svg';
import {getBlockHeightRequest} from "@/services/http/api/api";

function Page() {
  const [hoverStatus, setHoverStatus] = useState(false);

  const switchHoverStatus = () => {
    setHoverStatus(!hoverStatus);
  }

  // 定时器
  let interval: any = null;
  useEffect(() => {
    getBlockHeight();
    interval = setInterval(() => {
      getBlockHeight();
    }, 10000);

    return () => {
      clearInterval(interval);
    }
  }, []);

  const [blockHeight, setBlockHeight] = useState(0);
  // 获取区块高度
  const getBlockHeight = () => {
    getBlockHeightRequest().then((res) => {
      const data = res.data;
      setBlockHeight(data.block_height)
    }).catch((err) => {
      console.error(err);
    })
  }

  return (
    <div className={'homePage'}>
      <div className={'discover'}>
        <Rotational/>
        <MintRankTable blockHeight={blockHeight}/>
        <Transactions  blockHeight={blockHeight}/>
      </div>
      {
        hoverStatus &&
          <div className={'hoverBox'}>
              <img src={HoverBoxImg} className={'hoverImg'}/>
              <div className={'hoverContent'}>
                  <div className={'hoverBlock'}>
                      <div className={'hoverTitle'}><FormattedMessage id="home.aki.Stay"/>...</div>
                      <div className={'hoverList'}>
                          <div className={'listRow'}>
                              <img src={ReferIcon} className={'listIcon'}/>
                              <FormattedMessage id="home.aki.Refer"/>
                          </div>
                          <div className={'listRow'}>
                              <img src={TasksIcon} className={'listIcon'}/>
                              <FormattedMessage id="home.aki.Earn"/>
                          </div>
                          <div className={'listRow'}>
                              <img src={StakeIcon} className={'listIcon'}/>
                              <FormattedMessage id="home.aki.Stake"/>
                          </div>
                      </div>
                      <div className={'hoverBottom'}>
                          <div className={'subscribe'}>
                              <FormattedMessage id="home.aki.Subscribe"/>
                          </div>
                          <div className={'explore'} onClick={() => window.open('https://akiprotocol.io/dragonPool')}>
                              <FormattedMessage id="home.aki.Explore"/> $Aki <img src={ExploreIcon}
                                                                                  className={'exploreIcon'}/>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      }
      <div className={'littleHover'} onClick={switchHoverStatus}>
        <div className={'hoverArrowRow'}>
          <img src={HoverArrow} className={hoverStatus ? 'hoverArrow' : 'hoverArrow hidden'}/>
        </div>
        <img src={HoverIcon} className={'hoverIcon'}/>
      </div>
    </div>
  )
}

export default connect(({}: any) => ({}))(Page);
