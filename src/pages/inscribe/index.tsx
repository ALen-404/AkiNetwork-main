import React, {useState} from "react";
import './index.less';
import {connect, useIntl, useLocation} from "umi";
import BRC20Icon from '@/assets/inscribe/brc20-icon.svg';
import Mint from '@/components/Mint';
import Deploy from '@/components/Deploy';

function Page() {
  // 路由传参
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tick = params.get('tick');

  const intl = useIntl();
  const MintT = intl.formatMessage({
    id: 'inscribe.Mint',
  })
  const DeployT = intl.formatMessage({
    id: 'inscribe.Deploy',
  })
  // 头部切换
  const tabs = [
    {key: 0, value: MintT, component: <Mint tick={tick}/>},
    {key: 1, value: DeployT, component: <Deploy/>}
  ];
  const [active, setActive] = useState(0);
  const switchTab = (index: number) => {
    setActive(index);
  }

  return (
    <div className={'inscribe'}>
      <div className={'inscribe-card'}>
        <div className={'inscribe-header'}>
          <div className={'inscribe-header-top'}>
            <img src={BRC20Icon} className={'icon'}/>
            <span className={'titleText'}>BRC20</span>
          </div>
          <div className={'inscribe-tab'}>
            {
              tabs.map((item: any, index: number) => (
                <div
                  key={item.key}
                  className={active === index ? 'tabValue active' : 'tabValue'}
                  onClick={() => switchTab(index)}
                >{item.value}</div>
              ))
            }
          </div>
        </div>

        <div className={'inscribe-body'}>
          {tabs[active].component}
        </div>
      </div>
    </div>
  )
}

export default connect(({}: any) => ({}))(Page);
